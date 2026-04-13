const express = require('express');
const router = express.Router();
const controlador = require('./controlador');
// const seguridad = require('./seguridad'); // <--- El perro token se queda amarrado (comentado)

// RUTAS
// router.post('/', seguridad(), controlador.devolverProducto); // Versión con token comentada
router.post('/', controlador.devolverProducto); 
router.get('/', controlador.listarDevoluciones);

module.exports = router;