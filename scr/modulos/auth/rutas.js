const express = require('express');
const router = express.Router();
const controlador = require('./controlador.js'); 

// Solo le pasamos la bola al controlador
router.post('/login', controlador.login);

module.exports = router;