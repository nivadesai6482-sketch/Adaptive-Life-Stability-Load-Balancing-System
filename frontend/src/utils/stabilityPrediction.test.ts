import { describe, it, expect } from 'vitest';
import { predictFutureStability } from './stabilityPrediction';

describe('stabilityPrediction utility', () => {
    it('returns an empty array if there are fewer than 2 historical points', () => {
        const result = predictFutureStability([{ date: '2026-03-01', score: 50 }]);
        expect(result).toHaveLength(0);
    });

    it('predicts an upward trend given positive historical progression', () => {
        const historical = [
            { date: '2026-03-01', score: 50 },
            { date: '2026-03-02', score: 60 },
            { date: '2026-03-03', score: 70 },
        ];
        
        // y = 10x + 50
        // Expected Next: 80, 90, 100
        const predictions = predictFutureStability(historical, 3);
        
        expect(predictions).toHaveLength(3);
        expect(predictions[0].score).toBe(80);
        expect(predictions[1].score).toBe(90);
        expect(predictions[2].score).toBe(100);
        expect(predictions[0].date).toBe('2026-03-04');
    });

    it('predicts a downward trend given negative historical progression', () => {
        const historical = [
            { date: '2026-04-01', score: 90 },
            { date: '2026-04-02', score: 80 },
            { date: '2026-04-03', score: 70 },
        ];
        
        // y = -10x + 90
        // Expected Next: 60, 50
        const predictions = predictFutureStability(historical, 2);
        
        expect(predictions[0].score).toBe(60);
        expect(predictions[1].score).toBe(50);
        expect(predictions[0].date).toBe('2026-04-04');
    });

    it('clamps predictions to a maximum of 100', () => {
        const historical = [
            { date: '2026-05-01', score: 90 },
            { date: '2026-05-02', score: 95 },
            { date: '2026-05-03', score: 100 },
        ];
        
        const predictions = predictFutureStability(historical, 3);
        // It wants to predict 105, 110, 115 but should clamp
        
        expect(predictions[0].score).toBe(100);
        expect(predictions[1].score).toBe(100);
        expect(predictions[2].score).toBe(100);
    });

    it('clamps predictions to a minimum of 0', () => {
        const historical = [
            { date: '2026-05-01', score: 10 },
            { date: '2026-05-02', score: 5 },
            { date: '2026-05-03', score: 0 },
        ];
        
        const predictions = predictFutureStability(historical, 3);
        // It wants to predict -5, -10, -15 but should clamp
        
        expect(predictions[0].score).toBe(0);
        expect(predictions[1].score).toBe(0);
        expect(predictions[2].score).toBe(0);
    });

    it('maintains a flat line for stable historical data', () => {
        const historical = [
            { date: '2026-06-01', score: 75 },
            { date: '2026-06-02', score: 75 },
            { date: '2026-06-03', score: 75 },
        ];
        
        const predictions = predictFutureStability(historical, 2);
        expect(predictions[0].score).toBe(75);
        expect(predictions[1].score).toBe(75);
    });
});
