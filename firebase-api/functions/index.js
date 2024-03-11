const functions = require('firebase-functions');
const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');

const app = express();
app.use(cors());//es un metodo de seguridad o algo asi 

admin.initializeApp({
    credential: admin.credential.cert('./permiso.json'),
    databaseURL: 'https://fir-api-5a6f8-default-rtdb.firebaseio.com'
});

app.use(require('./routes/producto.routes'))

exports.app = functions.https.onRequest(app);