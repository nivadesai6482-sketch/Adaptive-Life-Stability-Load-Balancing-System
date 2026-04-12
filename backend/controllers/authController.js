const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    console.log('Registration attempt received:', { email: req.body?.email, name: req.body?.name });
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            console.log('Registration failed: Missing fields');
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        console.log('Checking if user exists...');
        const userExists = await User.findOne({ email });
        if (userExists) {
            console.log('Registration failed: User already exists');
            return res.status(400).json({ message: 'User already exists' });
        }

        console.log('Hashing password...');
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        console.log('Creating user in DB...');
        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });

        if (user) {
            console.log('User created successfully. Generating token...');
            const token = generateToken(user._id);
            res.status(201).json({
                _id: user.id,
                name: user.name,
                email: user.email,
                token
            });
        } else {
            console.log('Registration failed: User.create returned null');
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error('CRITICAL Registration Error:', error);
        res.status(500).json({ message: 'Server error', error: error.message, stack: error.stack });
    }
};

// @desc    Authenticate a user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                _id: user.id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id)
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error(`Login Error: ${error.message}`);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    registerUser,
    loginUser
};
