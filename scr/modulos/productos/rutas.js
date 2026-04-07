const express = require('express');
const router = express.Router();
const controlador = require('./controlador');
const auth = require('../auth/middleware');

// Rutas de Gestión de Productos
router.get('/', auth.verificarToken, controlador.listarProductos);
router.post('/', auth.verificarToken, controlador.crearProducto);
router.put('/:id', auth.verificarToken, controlador.actualizarProducto);
router.delete('/:id', auth.verificarToken, controlador.eliminarProducto);

module.exports = router;