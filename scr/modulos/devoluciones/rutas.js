const express = require('express');
const router = express.Router();
const controlador = require('./controlador');
// const seguridad = require('./seguridad'); 

// RUTAS
// router.post('/', seguridad(), controlador.devolverProducto); 
router.post('/', controlador.devolverProducto); 
router.get('/', controlador.listarDevoluciones);

module.exports = router;