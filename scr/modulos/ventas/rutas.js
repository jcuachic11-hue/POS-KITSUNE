const express = require('express');
const router = express.Router();
const controlador = require('./controlador');
const { verificarMiddleware } = require('../../admin'); 

// PROTECCIÓN TOTAL: Cualquier ruta definida abajo pasará por el portero
router.use(verificarMiddleware);

router.post('/carrito', controlador.agregarCarrito);
router.get('/carrito', controlador.listarCarrito);
router.get('/totales', controlador.totalesCarrito);
router.post('/comprar', controlador.comprar);

module.exports = router;