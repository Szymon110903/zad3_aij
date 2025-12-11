const express = require('express');
const userApi = express.Router();
const { StatusCodes } = require('http-status-codes');
const User = require('../models/user');
const jsonwebtoken = require('jsonwebtoken');

/**
 * @swagger
 * tags:
 *   - name: Użytkownicy
 *     description: Api - users
 */

userApi.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username: username });
        if (!user) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Nieprawidłowa nazwa użytkownika lub hasło' });
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Nieprawidłowa nazwa użytkownika lub hasło' });
        }

        const token = jsonwebtoken.sign({ 
            id: user._id, 
            username: user.username, 
            type: user.type }, 
            process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(StatusCodes.OK).json({ token: token });
    }catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
});
/**
 * @swagger
 * /auth/register:
 *   post:
 */
userApi.post('/register', async (req, res) => {
    try {
        const { username, password, type } = req.body;
        const existingUser = await User.findOne({ username: username });
        if (existingUser) {
            return res.status(StatusCodes.CONFLICT).json({ message: 'Nazwa użytkownika już istnieje' });
        }
        const newUser = new User({ username, password, type });
        await newUser.save();
        res.status(StatusCodes.CREATED).json({ message: 'Użytkownik zarejestrowany' });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
});

module.exports = userApi;