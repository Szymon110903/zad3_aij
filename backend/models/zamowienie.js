const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pozycjaZamowieniaSchema = new Schema({
  produkt: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Produkt',
    required: true
  },
  ilosc: {
    type: Number,
    required: true,
    min: 1,
    validate: {
      validator: Number.isInteger,
      message: '{VALUE} nie jest liczbą całkowitą'
    }
  },
  cenaWChwiliZakupu: { 
    type: Number,
    required: true
  },
  stawkaVat: { type: Number, default: 23 },
  rabat: { type: Number, default: 0 }
});

const zamowienieSchema = new Schema({
  dataZatwierdzenia: {type: Date, default: null},
  stan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'StanZamowienia', required: true },
  nazwaUzytkownika: { type: String, required: true },
  email: { type: String, required: true },
  telefon: { type: String, required: true },
  pozycje: [pozycjaZamowieniaSchema],
  sumaCalkowita: { type: Number }

}, {
  timestamps: false, collection: 'Zamowienia'
});

module.exports = mongoose.model('Zamowienie', zamowienieSchema);