const express = require('express');
const productApi = express.Router();
const { StatusCodes } = require('http-status-codes');
const Produkt = require('../models/models').Produkt;
const axios = require('axios');
const { model } = require('mongoose');

/**
 * @swagger
 * components:
 *   schemas:
 *     Produkt:
 *       type: object
 *       required:
 *         - nazwa
 *         - opis
 *         - cena_jednostkowa
 *         - kategoria
 *       properties:
 *         _id:
 *           type: string
 *           description: Automatyczne ID rekordu z MongoDB (ObjectId)
 *           example: 64f1a2b3c4d5e6f7a8b9c0d1
 *         nazwa:
 *           type: string
 *           description: Nazwa produktu
 *           example: "Wiertarka udarowa"
 *         opis:
 *           type: string
 *           description: Opis produktu
 *           example: "Profesjonalna wiertarka 700W"
 *         cena_jednostkowa:
 *           type: number
 *           format: float
 *           description: Cena za sztukę
 *           example: 199.99
 *         kategoria:
 *           type: string
 *           description: ID Kategorii (ObjectId) do której należy produkt
 *           example: "64f1a2b3c4d5e6f7a8b9c0d1"
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
 *   - name: Produkty
 *     description: Zarządzanie produktami
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Pobierz wszystkie produkty
 *     tags: [Produkty]
 *     responses:
 *       200:
 *         description: Lista produktów
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Produkt'
 *       500:
 *         description: Błąd serwera
 */
productApi.get('/', async (req, res) => {
    try {
        // Populate pobiera też dane kategorii (np. nazwę) zamiast samego ID
        const products = await Produkt.find({}).populate('kategoria');
        res.status(StatusCodes.OK).json(products);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
});

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Pobierz jeden produkt po ID (MongoDB _id)
 *     tags: [Produkty]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           description: MongoDB ObjectId produktu
 *     responses:
 *       200:
 *         description: Znaleziono produkt
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Produkt'
 *       404:
 *         description: Nie znaleziono produktu
 *       500:
 *         description: Błąd serwera
 */
productApi.get('/:id', async (req, res) => {
    try {
        const product = await Produkt.findById(req.params.id).populate('kategoria');
        if (product) {
            res.status(StatusCodes.OK).json(product);
        } else {
            res.status(StatusCodes.NOT_FOUND).json({ error: "Nie znaleziono produktu" });
        }
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
});

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Utwórz nowy produkt
 *     tags: [Produkty]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nazwa
 *               - opis
 *               - cena_jednostkowa
 *               - kategoria
 *             properties:
 *               nazwa:
 *                 type: string
 *                 example: "Nowy Produkt"
 *               opis:
 *                 type: string
 *                 example: "Opis produktu"
 *               cena_jednostkowa:
 *                 type: number
 *                 example: 50.00
 *               kategoria:
 *                 type: string
 *                 description: Podaj istniejące ID kategorii
 *                 example: "64f1a2b3c4d5e6f7a8b9c0d1"
 *     responses:
 *       201:
 *         description: Utworzono produkt
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Produkt'
 *       400:
 *         description: Błąd walidacji
 *       500:
 *         description: Błąd serwera
 */
productApi.post('/', async (req, res) => {
    try {
        const { nazwa, opis, cena_jednostkowa, kategoria } = req.body;

        const nowyProdukt = new Produkt({
            nazwa,
            opis,
            cena_jednostkowa,
            kategoria
        });

        const zapisanyProdukt = await nowyProdukt.save();
        res.status(StatusCodes.CREATED).json(zapisanyProdukt);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
});

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Aktualizuj produkt po ID (MongoDB _id)
 *     tags: [Produkty]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           description: MongoDB ObjectId produktu
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nazwa:
 *                 type: string
 *               opis:
 *                 type: string
 *               cena_jednostkowa:
 *                 type: number
 *               kategoria:
 *                 type: string
 *     responses:
 *       200:
 *         description: Zaktualizowano produkt
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Produkt'
 *       404:
 *         description: Nie znaleziono produktu
 *       500:
 *         description: Błąd serwera
 */
productApi.put('/:id', async (req, res) => {
    try {
        const produkt = await Produkt.findByIdAndUpdate(req.params.id, req.body, { new: true });
        
        if (produkt) {
            res.status(StatusCodes.OK).json(produkt);
        } else {
            res.status(StatusCodes.NOT_FOUND).json({ error: "Nie znaleziono produktu do aktualizacji" });
        }
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
});
/**
 * @swagger
 * /products/{id}/seo-description:
 *   get:
 *     summary: Generuj SEO opis produktu w formacie HTML za pomocą Groq API
 *     tags: [Produkty]
 *     parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *          description: MongoDB ObjectId produktu
 *     responses:
 *      200:
 *        description: Wygenerowano SEO opis produktu
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                seoDescription:
 *                  type: string
 *                  description: SEO opis produktu w formacie HTML
 *                  example: "<h2>Wiertarka udarowa - Profesjonalne narzędzie dla Ciebie</h2><p>...</p>"
 *      404:
 *        description: Nie znaleziono produktu
 *      500:
 *        description: Błąd serwera
 */

productApi.get('/:id/seo-description', async (req, res) => {
    try {
        const produkt = await Produkt.findById(req.params.id).populate('kategoria');
        if (!produkt) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: "Produkt nie znaleziony" });
        }
        const nazwaKategorii = produkt.kategoria ? produkt.kategoria.nazwa : "Ogólna";

        const systemPrompt = `
            Jesteś ekspertem SEO i copywriterem. Stwórz atrakcyjny opis produktu w formacie HTML dla sklepu internetowego 
            W języku Polskim.`;
        const userPrompt = `
            Dane produktu:
            - Nazwa: ${produkt.nazwa}
            - Opis techniczny: ${produkt.opis}
            - Cena: ${produkt.cena_jednostkowa} PLN
            - Kategoria: ${nazwaKategorii}
            
            Wymagania:
            - Użyj tagów HTML takich jak <h2>, <p>, <ul>, <li>, <strong>.
            - Tekst ma być zachęcający do zakupu i zawierać słowa kluczowe związane z nazwą i kategorią.
            - Nie dodawaj znaczników Markdown (jak \`\`\`html). Zwróć czysty kod HTML.
        `;
        const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
            model: 'openai/gpt-oss-120b',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt }
            ],
            max_tokens: 500,   
            temperature: 0.7
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
                'Content-Type': 'application/json',
            },
        }); 
        const seoDescription = response.data.choices[0].message.content.trim();
        res.status(StatusCodes.OK).json({ seoDescription: seoDescription });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
});

// productApi.post('/app_url/init', XMLHttpRequestUpload.single('file') ,async (req, res) => {
//     try {
//         const { app_url } = req.body;
//         // Tutaj można dodać logikę incjalizacji produktów z pliku podanego w app_url
//         res.status(StatusCodes.OK).json({ message: `Aplikacja zainicjalizowana pliku: ${app_url}` });
//     } catch (error) {
//         res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
//     }
// });

module.exports = productApi;