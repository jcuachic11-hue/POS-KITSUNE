const express = require('express');
const router = express.Router();
const controlador = require('./controlador');

// Estas son las funciones que SÍ existen en tu controlador.js
router.get('/', controlador.listarProductos);
router.get('/:id', controlador.uno);
router.post('/', controlador.guardarProducto);
router.delete('/:id', controlador.eliminarProducto);

module.exports = router;