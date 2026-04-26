const express = require('express');
const router = express.Router();
const controlador = require('./controlador');

const  verificarMiddleware  = require('../../admin');

// RUTAS
router.post('/carrito', verificarMiddleware, controlador.agregarCarrito);
router.get('/carrito', verificarMiddleware, controlador.listarCarrito);
router.get('/totales', verificarMiddleware, controlador.totalesCarrito);
router.post('/comprar', verificarMiddleware, controlador.comprar);

module.exports = router; // 