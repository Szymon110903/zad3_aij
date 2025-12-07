const express = require('express');
const router = express.Router();

router.use('/category' ,require('./category'));
router.use('/products' ,require('./produkt'));
router.use('/user' ,require('./user'));
router.use('/orders' ,require('./zamowienia'));

module.exports = router;