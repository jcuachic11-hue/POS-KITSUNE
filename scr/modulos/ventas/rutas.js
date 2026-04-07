const express = require('express');
const router = express.Router();
const controlador = require('./controlador');
const auth = require('../auth/middleware');

// Rutas del carrito de ventas
router.post('/carrito', auth.verificarToken, controlador.agregarCarrito);
router.get('/carrito', auth.verificarToken, controlador.listarCarrito);
router.get('/totales', auth.verificarToken, controlador.totalesCarrito);
router.post('/comprar', auth.verificarToken, controlador.comprar);

module.exports = router;