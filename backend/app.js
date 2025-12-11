
const express = require('express');
const env = require('dotenv').config();
const app = express();
const port = process.env.PORT;
const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('swagger-jsdoc');
const mongoose = require('mongoose');
app.use(express.json()); 

// podłączenie pliku api 
const apiRouter = require('./routes/api');
app.use('/api' ,apiRouter);


// ŁĄCZENIE Z BAZĄ
mongoose.connect(process.env.DATABASE_URL)
    .then(()=> console.log("polaczono do bazy"))
    .catch(err => console.error("Błąd połączenia z bazą:", err))


// Definicja opcji dla swagger-jsdoc
const url = 'http://localhost:'+process.env.PORT +'/api';
const options = {
  definition: {
    openapi: '3.0.0', 
    info: {
      title: 'API', 
      version: '1.0.0', 
      description: 'Dokumentacja API dla serwera Express z Mongoose',
    },
    servers: [{url: url, description: 'Serwer lokalny', }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    // security: [{ bearerAuth: [] }],
  },
  apis: ['./routes/*.js'], 
};
const specs = swaggerDocs(options);

// Uruchomienie Swagger UI na określonym endpoincie (np. /api-docs)
// app.use([endpoint], [serwowanie UI], [konfiguracja na podst. specs])
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.get('/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(specs);
});

app.listen(port, ()=> {
    console.log('');
    console.log('server działa');
});



