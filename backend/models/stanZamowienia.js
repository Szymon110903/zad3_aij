const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const stanZamowieniaSchema = new Schema({
  nazwa: { type: String, enum: [ 'NIEZATWIERDZONE', 'ZATWIERDZONE', 'ANULOWANE', 'ZREALIZOWANE'],
     required: true },
},
{ timestamps: true, collection: 'StanZamowienia' });

module.exports = mongoose.model('StanZamowienia', stanZamowieniaSchema);