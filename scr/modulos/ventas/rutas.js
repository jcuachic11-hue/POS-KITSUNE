const express = require('express');
const router = express.Router();
const controlador = require('./controlador');

// RUTAS
router.post('/carrito', controlador.agregarCarrito);
router.get('/carrito', controlador.listarCarrito);
router.get('/totales', controlador.totalesCarrito);
router.post('/comprar', controlador.comprar);

module.exports = router; // 