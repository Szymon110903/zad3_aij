const express = require('express');
const producktApi = express.Router();

/**
 * @swagger
 * tags:
 * - name: Produkty
 * description: Api - products
 */


producktApi.get('/products', async ()=> {
    // all produckts
})
producktApi.get('/products/id', async (id)=> {
    // get po id
})

producktApi.post('/products', async ()=> {
    // dodaje do bazy - dodać parametry
})

producktApi.put('/products/id', async (id)=> {
    // aktualizacja produktu
})

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *           example: "1"
 *         name:
 *           type: string
 *           example: "Sample product"
 *         description:
 *           type: string
 *           example: "A short description"
 *         price:
 *           type: number
 *           format: float
 *           example: 19.99
 *         weight:
 *           type: number
 *           format: float
 *           example: 0.5
 *         categoryId:
 *           type: number
 *           example: "1"
 *       required:
 *         - name
 *         - price
 *         - weight
 *         - categoryId
 *
 * /products:
 *   get:
 *     tags:
 *       - Produkty
 *     summary: Get all products
 *     responses:
 *       200:
 *         description: A list of products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *   post:
 *     tags:
 *       - Produkty
 *     summary: Create a new product
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: Product created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *
 * /products/{id}:
 *   parameters:
 *     - in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: string
 *       description: Product ID
 *   get:
 *     tags:
 *       - Produkty
 *     summary: Get a product by id
 *     responses:
 *       200:
 *         description: Product found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 *   put:
 *     tags:
 *       - Produkty
 *     summary: Update a product by id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: Product updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 */


module.exports = producktApi;