
const express = require('express');
require('dotenv').config();
const app = express();
const port = process.env.PORT;
const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('swagger-jsdoc');
const mongoose = require('mongoose');

// podłączenie pliku api 
const apiRouter = require('./routes/api');
app.use('/routes/api' ,apiRouter);
// dane JSON wysyłane w api
app.use(express.json()); 

// ŁĄCZENIE Z BAZĄ
mongoose.connect(process.env.DATABASE_URL)
    .then(()=> console.log("polaczono do bazy"))
    .catch(err => console.error("Błąd połączenia z bazą:", err))


// Definicja opcji dla swagger-jsdoc
const url = 'http://localhost:'+process.env.PORT;
const options = {
  definition: {
    openapi: '3.0.0', 
    info: {
      title: 'API', 
      version: '1.0.0', 
      description: 'Dokumentacja API dla serwera Express z Mongoose',
    },
    servers: [
      {
        url: url, 
        description: 'Serwer lokalny',
      },
    ],
  },
  apis: ['./routes/*.js', './app.js'], 
};
const specs = swaggerDocs(options);

// Uruchomienie Swagger UI na określonym endpoincie (np. /api-docs)
// app.use([endpoint], [serwowanie UI], [konfiguracja na podst. specs])
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));


app.listen(port, ()=> {
    console.log('');
    console.log('server działa');
});



