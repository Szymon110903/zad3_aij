const express = require('express');
const zamowieniaApi = express.Router();

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: API for managing orders
 */

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Get all orders
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: List of all orders
 *   post:
 *     summary: Add a new order
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               // define order properties here
 *     responses:
 *       201:
 *         description: Order created
 */

/**
 * @swagger
 * /orders/id:
 *   patch:
 *     summary: Change status of an order by ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Order status updated
 */

/**
 * @swagger
 * /orders/status/id:
 *   get:
 *     summary: Get orders with a specific status
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Status ID
 *     responses:
 *       200:
 *         description: Orders with specified status
 */

/**
 * @swagger
 * /orders/status:
 *   get:
 *     summary: Get all possible order statuses
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: List of all order statuses
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Zamowienie:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         dataZatwierdzenia:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         stanZamowienia:
 *           $ref: '#/components/schemas/StanZamowienia'
 *         nazwaUzytkownika:
 *           type: string
 *         email:
 *           type: string
 *         numerTelefonu:
 *           type: string
 *         towary:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               towarId:
 *                 type: integer
 *               liczbaSztuk:
 *                 type: integer
 *                 minimum: 1
 *     StanZamowienia:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         nazwa:
 *           type: string
 *           enum: [UNCONFIRMED, CONFIRMED, CANCELLED, COMPLETED]
 */

zamowieniaApi.get('/orders', async () => {
    //zwraca wszystkie zamówienia
});
zamowieniaApi.post('/orders', async () => {
    //dodaje zamówienie (parametry w ciele żądania)
});
zamowieniaApi.patch('/orders/id', async () => {
    // zmiana stanu zamówienia o podanym identyfikatorze
});
zamowieniaApi.get('/orders/status/id', async () => {
    // pobranie zamówień z określonym stanem
});
zamowieniaApi.get('/orders/status', async () => {
    //  zwraca wszystkie możliwe stany zamówienia
});
module.exports = zamowieniaApi;