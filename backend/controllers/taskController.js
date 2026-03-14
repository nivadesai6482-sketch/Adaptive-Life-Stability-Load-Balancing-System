const Task = require('../models/Task');

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Public
const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find().sort({ createdAt: -1 });
        res.status(200).json(tasks);
    } catch (error) {
        console.error(`Error fetching tasks: ${error.message}`);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Public
const createTask = async (req, res) => {
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
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Public
const deleteTask = async (req, res) => {
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
};

module.exports = {
    getTasks,
    createTask,
    deleteTask
};
