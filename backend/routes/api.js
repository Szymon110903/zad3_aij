const express = require('express');
const router = express.Router();

router.use('/category' ,require('./category'));
router.use('/produkt' ,require('./produkt'));
router.use('/user' ,require('./user'));
router.use('/zamowienia' ,require('./zamowienia'));

module.exports = router;