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

module.exports = categoryApi;