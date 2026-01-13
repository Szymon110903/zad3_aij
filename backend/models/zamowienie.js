const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const opiniaSchema = new Schema({
    ocena : {
        type: Number,
        required: true,
        min: 1,
        max: 5,
        validate: {
            validator: Number.isInteger,
            message: '{VALUE} nie jest liczbą całkowitą'
        }
    },
    komentarz : { type: String }
});
const zamieszkanieSchema = new Schema({
  miejscowosc: {type: String, required: true},
  kod_pocztowy: {type: String, required: true},
  ulica: {type: String, required: true},
  nrDomu: {type: String, required: true}
}, {timestamps: false} );

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
  },
  cenaWChwiliZakupu: { 
    type: Number,
    required: true
  },
  stawkaVat: { type: Number, default: 23 },
  rabat: { type: Number, default: 0 }
}, {timestamps: false});

const zamowienieSchema = new Schema({
  dataZatwierdzenia: {type: Date, default: null},
  stan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'StanZamowienia', required: true },
  nazwaUzytkownika: { type: String, required: true },
  imie: { type: String, required: true },
  nazwisko: { type: String, required: true },
  email: { type: String, required: true },
  telefon: { type: String, required: true },
  pozycje: { type: [pozycjaZamowieniaSchema], required: true },
  sumaCalkowita: { type: Number },
  opinia: { type: opiniaSchema, default: null, required: false },
  zamieszkanie: {type: zamieszkanieSchema, required: true}
}, {
  timestamps: false, collection: 'Zamowienia'
});

module.exports = mongoose.model('Zamowienie', zamowienieSchema);