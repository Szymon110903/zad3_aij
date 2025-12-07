require('dotenv').config(); // Ładujemy zmienne środowiskowe (.env)
const mongoose = require('mongoose');
const { StanZamowienia } = require('./models/models'); // Upewnij się, że ta ścieżka jest OK

// Pobieramy adres bazy z pliku .env
const MONGO_URI = process.env.DATABASE_URL;

// Lista stanów do dodania (zgodna z Twoim ENUM w modelu)
const stanyDoDodania = [
  { nazwa: 'NIEZATWIERDZONE' },
  { nazwa: 'ZATWIERDZONE' },
  { nazwa: 'ANULOWANE' },
  { nazwa: 'ZREALIZOWANE' }
];

const seedStany = async () => {
  try {
    // 1. Łączenie z bazą (wymuszamy bazę 'sklep' dla pewności)
    console.log('🔌 Łączenie z bazą...');
    await mongoose.connect(MONGO_URI);

    // 2. Czyszczenie starej kolekcji (opcjonalne, ale zalecane, żeby nie dublować)
    console.log('🧹 Czyszczenie starych stanów...');
    await StanZamowienia.deleteMany({});

    // 3. Dodawanie nowych
    console.log('🌱 Dodawanie 4 stanów...');
    await StanZamowienia.insertMany(stanyDoDodania);

    console.log('✅ SUKCES! Dodano stany:');
    stanyDoDodania.forEach(s => console.log(` - ${s.nazwa}`));

  } catch (error) {
    console.error('❌ Błąd:', error);
  } finally {
    // 4. Rozłączenie
    await mongoose.disconnect();
    console.log('👋 Rozłączono.');
    process.exit();
  }
};

seedStany();