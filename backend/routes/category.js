const express = require('express');
const categoryApi = express.Router();
const Kategoria = require('../models/kategoria');
const { StatusCodes } = require('http-status-codes');

/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Unikalne ID (Auto)
 *           example: 64f1a2b3c4d5e6f7a8b9c0d1
 *         nazwa:
 *           type: string
 *           description: Nazwa kategorii
 *           example: Elektronika
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Data utworzenia (Auto)
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Data ostatniej edycji (Auto)
 */

/**
 * @swagger
 * tags:
 *   - name: Kategoria
 *     description: Zarządzanie kategoriami
 */

/**
 * @swagger
 * /category:
 *   get:
 *     summary: Zwraca wszystkie kategorie
 *     tags:
 *       - Kategoria
 *     responses:
 *       '200':
 *         description: Pomyślnie zwrócono listę kategorii
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 *       '500':
 *         description: Błąd serwera
 */

categoryApi.get('/', async (req, res) => {
  try {
    const kategorie = await Kategoria.find({});
    res.status(StatusCodes.OK).json(kategorie);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
});
/** * @swagger
 * /category:
 *   post:
 *     summary: Dodaj nową kategorię
 *     tags:
 *       - Kategoria
 *     requestBody:  
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nazwa:
 *                 type: string
 *                 description: Nazwa kategorii
 *                 example: Elektronika
 *     responses:
 *       '201':
 *         description: Kategoria została pomyślnie dodana
 *         content:
 *           application/json:
 *             schema: 
 *               $ref: '#/components/schemas/Category'
 *       '500':
 *         description: Błąd serwera
 * 
 */

categoryApi.post('/', async (req, res) => {
  try {
    const { nazwa } = req.body;
    const nowaKategoria = new Kategoria({ nazwa });
    const zapisanaKategoria = await nowaKategoria.save();
    res.status(StatusCodes.CREATED).json(zapisanaKategoria);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
});
module.exports = categoryApi;