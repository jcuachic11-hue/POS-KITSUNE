const express = require('express');
const router = express.Router();
const controlador = require('./controlador');
const { verificarMiddleware } = require('../../admin'); // Ruta idéntica a Ventas

// PROTECCIÓN TOTAL
router.use(verificarMiddleware);

router.post('/', controlador.devolverProducto); 
router.get('/', controlador.listarDevoluciones);

module.exports = router;