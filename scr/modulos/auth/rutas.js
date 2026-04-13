const express = require('express');
const router = express.Router();
const controlador = require('./controlador.js'); 

// Esta ruta es la que genera el token, así que va libre
router.post('/', controlador.login); 

module.exports = router;