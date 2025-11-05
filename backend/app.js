
const express = require('express');
const app = express();
const port = 3000;

// podłączenie pliku api 
const apiRouter = require('./routes/api');
app.use('/routes/api' ,apiRouter);
// dane JSON wysyłane w api
app.use(express.json()); 
// app.use('mongoose');



app.listen(port, ()=> {
    console.log('');
    console.log('server działa');
});



