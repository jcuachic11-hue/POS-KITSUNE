const express = require('express');
const router = express.Router();
const controlador = require('./controlador');
// const auth = require('../auth/middleware'); // Comentado para facilitar pruebas

router.post('/carrito', controlador.agregarCarrito);
router.get('/carrito', controlador.listarCarrito);
router.get('/totales', controlador.totalesCarrito);
router.post('/comprar', controlador.comprar);

module.exports = router;