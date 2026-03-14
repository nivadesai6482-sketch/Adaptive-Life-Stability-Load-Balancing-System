import { describe, it, expect } from 'vitest';
import { balanceLoad } from './loadBalancer';
import { Task } from '../store/taskStore';

describe('loadBalancer utility', () => {
    
    // Helper to generate mock tasks rapidly
    const createMockTask = (id: string, priority: 'low'|'medium'|'high', daysFromNow: number = 0): Task => {
        const date = new Date();
        date.setDate(date.getDate() + daysFromNow);
        return {
            _id: id,
            title: `Task ${id}`,
            priority,
            deadline: date.toISOString().split('T')[0],
            status: 'todo'
        };
    };

    it('focuses all tasks when cognitive capacity is high (Optimal > 75)', () => {
        const tasks = [
            createMockTask('1', 'high'),   // weight 3
            createMockTask('2', 'medium'), // weight 2
            createMockTask('3', 'low'),    // weight 1
        ]; // Total Weight: 6 (Capacity is 12)

        const result = balanceLoad(tasks, 80);
        
        expect(result.length).toBe(3);
        expect(result[0].suggestedAction).toBe('focus');
        expect(result[1].suggestedAction).toBe('focus');
        expect(result[2].suggestedAction).toBe('focus');
    });

    it('defers medium/low tasks when capacity is critical (< 50)', () => {
        const tasks = [
            createMockTask('1', 'high'),   // weight 3 (takes up all capacity of 3)
            createMockTask('2', 'medium', 1), // weight 2 (should defer)
            createMockTask('3', 'low', 1),    // weight 1 (should drop)
        ]; 

        const result = balanceLoad(tasks, 40); // Critical capacity is 3
        
        // Based on logic, high should be processed first, maxing out capacity
        const highTask = result.find(t => t._id === '1');
        const medTask = result.find(t => t._id === '2');
        const lowTask = result.find(t => t._id === '3');

        expect(highTask?.suggestedAction).toBe('focus');
        expect(medTask?.suggestedAction).toBe('defer');
        expect(lowTask?.suggestedAction).toBe('drop');
    });

    it('overrides capacity limit for overdue high-priority tasks', () => {
        const tasks = [
            createMockTask('1', 'high', 0),   
            createMockTask('2', 'high', 0), 
            createMockTask('3', 'high', -1), // Overdue  
        ]; 

        // Critical capacity is 3. Only the first High should fit perfectly.
        // However, all are high priority AND due today/overdue.
        // Therefore, loadBalancer must emit warning but force them to 'focus'
        const result = balanceLoad(tasks, 30); 
        
        expect(result[0].suggestedAction).toBe('focus');
        expect(result[1].suggestedAction).toBe('focus');
        expect(result[2].suggestedAction).toBe('focus');
        
        // verify reason highlights the override
        expect(result[2].reason).toContain('Critical task overrides low cognitive capacity');
    });

    it('sorts tasks properly by priority then deadline', () => {
        const tasks = [
            createMockTask('low_1', 'low', 0),   
            createMockTask('med_far', 'medium', 10), 
            createMockTask('med_near', 'medium', 1),  
            createMockTask('high_1', 'high', 5),  
        ]; 

        const result = balanceLoad(tasks, 100); 
        
        // Expected order: High, Med_near, Med_far, Low
        expect(result[0]._id).toBe('high_1');
        expect(result[1]._id).toBe('med_near');
        expect(result[2]._id).toBe('med_far');
        expect(result[3]._id).toBe('low_1');
    });
});
