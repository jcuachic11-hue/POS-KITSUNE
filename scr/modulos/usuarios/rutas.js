const express = require('express');
const router = express.Router();
const controlador = require('./controlador');
const auth = require('../auth/middleware');

// Gestión de Usuarios
router.get('/', auth.verificarToken, controlador.listarUsuarios);
router.post('/', auth.verificarToken, controlador.crearUsuario);
router.put('/:id', auth.verificarToken, controlador.actualizarUsuario);
router.delete('/:id', auth.verificarToken, controlador.eliminarUsuario);

module.exports = router;