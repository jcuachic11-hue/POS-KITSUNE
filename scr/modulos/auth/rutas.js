const express = require('express');
const router = express.Router();
const controlador = require('./controlador.js'); 

// ruta token
router.post('/', controlador.login); 

module.exports = router;