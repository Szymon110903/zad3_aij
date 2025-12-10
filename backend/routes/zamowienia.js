const express = require('express');
const zamowieniaApi = express.Router();
const { StatusCodes } = require('http-status-codes');
const { Zamowienie, StanZamowienia } = require('../models/models'); 

/**
 * @swagger
 * components:
 *   schemas:
 *     PozycjaZamowienia:
 *       type: object
 *       required:
 *         - produkt
 *         - ilosc
 *         - cenaWChwiliZakupu
 *       properties:
 *         produkt:
 *           type: string
 *           description: ID Produktu (ObjectId)
 *           example: "64f1a2b3c4d5e6f7a8b9c0d1"
 *         ilosc:
 *           type: integer
 *           minimum: 1
 *           example: 5
 *         cenaWChwiliZakupu:
 *           type: number
 *           example: 49.99
 *         stawkaVat:
 *           type: number
 *           default: 23
 *         rabat:
 *           type: number
 *           default: 0
 *     StanZamowienia:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         nazwa:
 *           type: string
 *           enum:
 *             - NIEZATWIERDZONE
 *             - ZATWIERDZONE
 *             - ANULOWANE
 *             - ZREALIZOWANE
 *     Zamowienie:
 *       type: object
 *       required:
 *         - stan
 *         - nazwaUzytkownika
 *         - email
 *         - telefon
 *       properties:
 *         dataZatwierdzenia:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         stan:
 *           type: string
 *           description: ID Stanu Zamówienia (ObjectId)
 *           example: "64f1a2b3c4d5e6f7a8b9c0d1"
 *         nazwaUzytkownika:
 *           type: string
 *           example: "Jan Kowalski"
 *         email:
 *           type: string
 *           format: email
 *           example: "jan@example.com"
 *         telefon:
 *           type: string
 *           example: "123-456-789"
 *         sumaCalkowita:
 *           type: number
 *           example: 250.00
 *         pozycje:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/PozycjaZamowienia'
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * tags:
 *   - name: Zamowienia
 *     description: Zarządzanie zamówieniami
 */

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Pobierz wszystkie zamówienia
 *     tags:
 *       - Zamowienia
 *     responses:
 *       '200':
 *         description: Lista zamówień
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Zamowienie'
 *       '500':
 *         description: Błąd serwera
 */
zamowieniaApi.get('/', async (req, res) => {
    try {
        const zamowienia = await Zamowienie.find({})
            .populate('stan')
            .populate('pozycje.produkt');
            
        res.status(StatusCodes.OK).json(zamowienia);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
});

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Dodaj nowe zamówienie
 *     tags:
 *       - Zamowienia
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - stan
 *               - nazwaUzytkownika
 *               - email
 *               - telefon
 *               - pozycje
 *             properties:
 *               stan:
 *                 type: string
 *                 description: ID istniejącego Stanu
 *               nazwaUzytkownika:
 *                 type: string
 *               email:
 *                 type: string
 *               telefon:
 *                 type: string
 *               sumaCalkowita:
 *                 type: number
 *               pozycje:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/PozycjaZamowienia'
 *     responses:
 *       '201':
 *         description: Utworzono zamówienie
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Zamowienie'
 *       '500':
 *         description: Błąd serwera
 */
zamowieniaApi.post('/', async (req, res) => {
    try {
        const noweZamowienie = new Zamowienie(req.body);
        const zapisane = await noweZamowienie.save();
        res.status(StatusCodes.CREATED).json(zapisane);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
});

/**
 * @swagger
 * /orders/{id}:
 *   patch:
 *     summary: Zmień STAN zamówienia po numerze ID 
 *     tags:
 *       - Zamowienia
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId (_id)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               stan:
 *                 type: string
 *                 description: ID nowego stanu (ObjectId)
 *                 example: "64f1a2b3c4d5e6f7a8b9c0d1"
 *     responses:
 *       '200':
 *         description: Zaktualizowano stan
 *       '404':
 *         description: Nie znaleziono zamówienia
 */
zamowieniaApi.patch('/:id', async (req, res) => {
    try {
        const { stan } = req.body;
        const idZamowienia = req.params.id;

        const stanZamowienia = await StanZamowienia.findOne({ nazwa: 'ZATWIERDZONE' });
        if (!stanZamowienia) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Nie znaleziono stanu ZATWIERDZONE" });
        }
        let daneDoAktualizacji = { stan: stan };
        if (stan === stanZamowienia._id.toString()) {
            daneDoAktualizacji.dataZatwierdzenia = new Date();
        }

        const zamowienie = await Zamowienie.findByIdAndUpdate(
            req.params.id, 
            daneDoAktualizacji,
            { new: true }
        ).populate('stan');

        if (zamowienie) {
            res.status(StatusCodes.OK).json(zamowienie);
        } else {
            res.status(StatusCodes.NOT_FOUND).json({ error: "Zamówienie nie znalezione" });
        }
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
});

/**
 * @swagger
 * /orders/status:
 *   get:
 *     summary: Pobierz wszystkie możliwe stany zamówień
 *     tags:
 *       - Zamowienia
 *     responses:
 *       '200':
 *         description: Lista stanów
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/StanZamowienia'
 */
zamowieniaApi.get('/status', async (req, res) => {
    try {
        const stany = await StanZamowienia.find({});
        res.status(StatusCodes.OK).json(stany);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
});

/**
 * @swagger
 * /orders/status/{id}:
 *   get:
 *     summary: Pobierz zamówienia o określonym stanie
 *     description: Zwraca listę zamówień, które mają przypisany konkretny status (np. ID stanu "ZATWIERDZONE").
 *     tags:
 *       - Zamowienia
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID Stanu (ObjectId) - pobierz je z GET /orders/status
 *     responses:
 *       '200':
 *         description: Lista zamówień o danym stanie
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Zamowienie'
 *       '500':
 *         description: Błąd serwera
 */
zamowieniaApi.get('/status/:id', async (req, res) => {
    try {
        const zamowienia = await Zamowienie.find({ stan: req.params.id })
            .populate('stan')             
            .populate('pozycje.produkt'); 
            
        res.status(StatusCodes.OK).json(zamowienia);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
});

module.exports = zamowieniaApi;