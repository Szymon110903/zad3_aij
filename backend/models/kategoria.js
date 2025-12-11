const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const kategorieSchema = new Schema({
    nazwa: { type: String, required: true, trim: true, unique: true},
},
{ timestamps: false, collection: 'Kategorie' });

module.exports = mongoose.model('Kategoria', kategorieSchema);