const express = require('express');
const zamowieniaApi = express.Router();
const { StatusCodes } = require('http-status-codes');
const { Zamowienie, StanZamowienia } = require('../models/models'); 
const { verifyToken } = require('../middleware');


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
 *     security:
 *      - bearerAuth: []
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
 *     security:
 *      - bearerAuth: []
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
        if (noweZamowienie.stan == null) {
            return res.status(StatusCodes.BAD_REQUEST).json({ error: "Pole stan jest wymagane" });
        }
        const stanZamowienia = await StanZamowienia.findById(noweZamowienie.stan);
        if (!stanZamowienia) {
            return res.status(StatusCodes.BAD_REQUEST).json({ error: "Nieprawidłowe ID stanu zamówienia" });
        }
        if (!noweZamowienie.pozycje || noweZamowienie.pozycje.length === 0) {
            return res.status(StatusCodes.BAD_REQUEST).json({ error: "Zamówienie musi zawierać co najmniej jedną pozycję" });
        }
        for (const pozycja of noweZamowienie.pozycje) {
            if (!pozycja.ilosc || pozycja.ilosc < 1) {
                return res.status(StatusCodes.BAD_REQUEST).json({ 
                    error: `Błąd: Ilość dla produktu ${pozycja.produkt} musi być większa niż 0` 
                });
            }
            if (pozycja.cenaWChwiliZakupu < 0) {
                 return res.status(StatusCodes.BAD_REQUEST).json({ error: "Cena nie może być ujemna" });
            }
        }
        noweZamowienie.sumaCalkowita = noweZamowienie.pozycje.reduce((sum, pozycje) => {
            const cenaPoRabacie = pozycje.cenaWChwiliZakupu * (1 - (pozycje.rabat || 0) / 100);
            return sum + cenaPoRabacie * pozycje.ilosc;
        }, 0);
        if (isNaN(noweZamowienie.sumaCalkowita) || noweZamowienie.sumaCalkowita < 0) {
            return res.status(StatusCodes.BAD_REQUEST).json({ error: "Suma całkowita zamówienia jest nieprawidłowa" });
        }
        if (noweZamowienie.stan == null || noweZamowienie.nazwaUzytkownika == null || noweZamowienie.email == null || noweZamowienie.telefon == null
            || noweZamowienie.stan === '' || noweZamowienie.nazwaUzytkownika === '' || noweZamowienie.email === '' || noweZamowienie.telefon === ''
        ) {
            return res.status(StatusCodes.BAD_REQUEST).json({ error: "Pola stan, nazwaUzytkownika, email i telefon są wymagane" });
        }
    
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
 *     security:
 *      - bearerAuth: []
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

/**
 * @swagger
 * /orders/{id}/opinia:
 *   post:
 *     summary: Dodaj opinię do zamówienia
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Zamowienia
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID Zamówienia (ObjectId)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ocena
 *             properties:
 *               ocena:
 *                 type: integer
 *                 description: Ocena od 1 do 5
 *               komentarz:
 *                 type: string
 *                 description: Komentarz do opinii
 *     responses:
 *       '200':
 *         description: Opinia dodana pomyślnie
 *       '400':
 *         description: Błąd w danych wejściowych
 *       '403':
 *         description: Brak uprawnień do dodania opinii do tego zamówienia
 *       '404':
 *         description: Zamówienie nie znalezione
 *       '500':
 *         description: Błąd serwera
 */

zamowieniaApi.post('/:id/opinia',verifyToken,async (req, res) => {
    try {
        const { ocena, komentarz } = req.body;
        const idZamowienia = req.params.id;
        const zamowienie = await Zamowienie.findById(idZamowienia).populate('stan');
        const username = req.user.username;
         if (!zamowienie) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: "Zamówienie nie znalezione" });
        }
        if (zamowienie.nazwaUzytkownika !== username) {
            return res.status(StatusCodes.FORBIDDEN).json({ error: "Nie masz uprawnień do dodania opinii do tego zamówienia" });
        }
        if (zamowienie.opinia) {
            return res.status(StatusCodes.BAD_REQUEST).json({ error: "Opinia do tego zamówienia już istnieje" });
        }
        if (zamowienie.stan.nazwa !== 'ZREALIZOWANE' && zamowienie.stan.nazwa !== 'ANULOWANE') {
            return res.status(StatusCodes.BAD_REQUEST).json({ error: "Opinię można dodać tylko do zamówień o stanie ZREALIZOWANE lub ANULOWANE" });
        }
        zamowienie.opinia = { ocena, komentarz };
        await zamowienie.save();
        res.status(StatusCodes.OK).json(zamowienie);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
});


/**
 * @swagger
 * /orders/{username}:
 *   get:
 *     summary: Get all orders for a specific user
 *     description: Retrieves all orders associated with the given username, including order status and product details
 *     tags: [Zamowienia]
 *     security: 
 *        - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *         description: The username to retrieve orders for
 *     responses:
 *       200:
 *         description: Successfully retrieved orders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   nazwaUzytkownika:
 *                     type: string
 *                   stan:
 *                     type: object
 *                     description: Order status details
 *                   pozycje:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         produkt:
 *                           type: object
 *                           description: Product details
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */

zamowieniaApi.get('/:username', verifyToken, async (req, res) => {
    try {
        const usernameFromUrl = req.params.username;
        const loggedInUser = req.user;

        if (usernameFromUrl !== loggedInUser.username) {
            return res.status(StatusCodes.FORBIDDEN).json({ error: "Brak dostępu do zamówień innego użytkownika" });
        }
        
         const zamowienia = await Zamowienie.find({ nazwaUzytkownika: req.params.username })
            .populate('stan')             
            .populate('pozycje.produkt');
            
        res.status(StatusCodes.OK).json(zamowienia);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error : error.message});
    }

});
module.exports = zamowieniaApi;