const express = require('express');
const router = express.Router();

router.use('/category' ,require('./category'));
router.use('/products' ,require('./produkt'));
router.use('/auth' ,require('./auth'));
router.use('/orders' ,require('./zamowienia'));

module.exports = router;