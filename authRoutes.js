const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('./models/User');

router.post('/register', async (req, res) => {
    const { username, password, email } = req.body;

    console.log('Registering new user:', req.body);

    try {
        const newUser = new User({ username, password, email });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully!' });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'Error registering user' });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    console.log('Attempting login for:', email);

    try {
        const user = await User.findOne({ email });
        if (user && user.password === password) {
            const token = jwt.sign({ id: user._id }, 'yourSecretKey', { expiresIn: '1h' });
            res.status(200).json({ message: 'Login successful', token });
        } else {
            console.error('Invalid credentials for:', email);
            res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ error: 'Error logging in' });
    }
});

module.exports = router;
