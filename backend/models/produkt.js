const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const produktSchema = new Schema({
    nazwa: { type: String, required: true, trim: true },
    opis: { type: String, required: true, trim: true },
    cena_jednostkowa: { type: Number, required: true, min:0 },
    kategoria: { type: Schema.Types.ObjectId, ref: 'Kategoria', required: true },
},
{ timestamps: false, collection: 'Produkty' });


module.exports = mongoose.model('Produkt', produktSchema);