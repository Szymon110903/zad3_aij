const models = {};

models.Produkt = require('./produkt');
models.Kategoria = require('./kategoria');
models.StanZamowienia = require('./stanZamowienia');
models.Zamowienie = require('./zamowienie');
models.User = require('./user');

module.exports = models;
