const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

/**
 * @route   GET /api/tasks
 * @desc    Get all tasks
 * @access  Public (for now)
 */
router.get('/', async (req, res) => {
    try {
        const tasks = await Task.find().sort({ createdAt: -1 });
        res.status(200).json(tasks);
    } catch (error) {
        console.error(`Error fetching tasks: ${error.message}`);
        res.status(500).json({ message: 'Server Error' });
    }
});

/**
 * @route   POST /api/tasks
 * @desc    Create a new task
 * @access  Public (for now)
 */
router.post('/', async (req, res) => {
    try {
        const { title, priority, deadline, status } = req.body;

        if (!title || !deadline) {
            return res.status(400).json({ message: 'Title and deadline are required' });
        }

        const newTask = await Task.create({
            title,
            priority,
            deadline,
            status
        });

        res.status(201).json(newTask);
    } catch (error) {
        console.error(`Error creating task: ${error.message}`);
        res.status(500).json({ message: 'Server Error' });
    }
});

/**
 * @route   DELETE /api/tasks/:id
 * @desc    Delete a task
 * @access  Public (for now)
 */
router.delete('/:id', async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        await task.deleteOne();
        res.status(200).json({ id: req.params.id, message: 'Task deleted successfully' });
    } catch (error) {
        console.error(`Error deleting task: ${error.message}`);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
