const express = require('express');
const userApi = express.Router();
const { StatusCodes } = require('http-status-codes');
const User = require('../models/user');
const jsonwebtoken = require('jsonwebtoken');

/**
 * @swagger
 * components:
 *   schemas:
 *     UserLogin:
 *       type: object
 *       required:
 *         - username
 *         - password
 *       properties:
 *         username:
 *           type: string
 *           description: Nazwa użytkownika
 *           example: "admin"
 *         password:
 *           type: string
 *           format: password
 *           description: Hasło użytkownika
 *           example: "admin"
 *     UserRegister:
 *       type: object
 *       required:
 *         - username
 *         - password
 *       properties:
 *         username:
 *           type: string
 *           example: "admin"
 *         password:
 *           type: string
 *           format: password
 *           example: "admin"
 *         type:
 *           type: string
 *           description: Rola użytkownika - ['ADMIN', 'CUSTOMER']
 *           example: "ADMIN"
 *           default: "CUSTOMER"
 * tags:
 *   - name: Użytkownicy
 *     description: Logowanie i rejestracja
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Zaloguj się (Pobierz token JWT)
 *     tags: [Użytkownicy]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserLogin'
 *     responses:
 *       200:
 *         description: Pomyślnie zalogowano
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: Token JWT
 *       401:
 *         description: Nieprawidłowa nazwa użytkownika lub hasło
 *       500:
 *         description: Błąd serwera
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Zarejestruj nowego użytkownika
 *     tags: [Użytkownicy]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserRegister'
 *     responses:
 *       201:
 *         description: Użytkownik zarejestrowany pomyślnie
 *       409:
 *         description: Nazwa użytkownika już istnieje
 *       500:
 *         description: Błąd serwera
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
        
        res.status(StatusCodes.OK).json({
            token: token,
            username: user.username,
            type: user.type
         });
    }catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
});
/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Zarejestruj nowego użytkownika
 *     tags: [Użytkownicy]
 *     requestBody:
 *       required: true
 *     content:
 *       application/json:
 *         schema:
 *           $ref: '#/components/schemas/UserRegister'
 *     responses:
 *       201:
 *         description: Użytkownik zarejestrowany pomyślnie
 *       409:
 *         description: Nazwa użytkownika już istnieje
 *       500:
 *         description: Błąd serwera
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