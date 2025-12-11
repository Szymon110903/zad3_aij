const express = require('express');
const categoryApi = express.Router();
const Kategoria = require('../models/kategoria');
const { StatusCodes } = require('http-status-codes');
const {verifyToken} = require('../middleware');
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

/** @swagger
 * /category:
 *   post:
 *     summary: Dodaj nową kategorię
 *     security:
 *       - bearerAuth: []
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
 */

categoryApi.post('/', verifyToken, async (req, res) => {
  
  try {
    const { nazwa } = req.body;
    const nowaKategoria = new Kategoria({ nazwa });
    const zapisanaKategoria = await nowaKategoria.save();
    res.status(StatusCodes.CREATED).json(zapisanaKategoria);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
});

/**
 * @swagger
 * /category/{id}:
 *   delete:
 *     summary: Usuń kategorię według ID
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Kategoria
 *     parameters:
 *       - in: path 
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unikalne ID kategorii
 *     responses:
 *       '200':
 *         description: Kategoria została pomyślnie usunięta
 *       '404':
 *         description: Kategoria nie znaleziona
 *       '500':
 *         description: Błąd serwera
 */

categoryApi.delete('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const usunietaKategoria = await Kategoria.findByIdAndDelete(id);
    if (!usunietaKategoria) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'Kategoria nie znaleziona' });
    }
    res.status(StatusCodes.OK).json({ message: 'Kategoria usunięta pomyślnie' });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
});

/**
 * @swagger
 * /category/{id}:
 *   put:
 *     summary: Zaktualizuj kategorię według ID
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Kategoria
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unikalne ID kategorii
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nazwa:
 *                 type: string
 *                 description: Nowa nazwa kategorii
 *                 example: Nowa Elektronika
 *     responses:
 *       '200':
 *         description: Kategoria została pomyślnie zaktualizowana
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       '404':
 *         description: Kategoria nie znaleziona
 *       '500':
 *         description: Błąd serwera
 */
categoryApi.put('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { nazwa } = req.body;
    const zaktualizowanaKategoria = await Kategoria.findByIdAndUpdate(
      id,
      { nazwa },
      { new: true }
    );
    if (!zaktualizowanaKategoria) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'Kategoria nie znaleziona' });
    }
    res.status(StatusCodes.OK).json(zaktualizowanaKategoria);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
});

module.exports = categoryApi;