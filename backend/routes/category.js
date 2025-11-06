const express = require('express');
const categoryApi = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Kategoria
 *     description: Api - category
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

categoryApi.get('/category', async (req, res) => {
    // ... logika pobierania kategorii ...
});


module.exports = categoryApi;