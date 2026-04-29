const express = require('express');
const router = express.Router();
const controlador = require('./controlador');
const { verificarMiddleware } = require('../../admin'); 


router.use(verificarMiddleware);

router.get('/', controlador.listarUsuarios);
router.post('/', controlador.crearUsuario);
router.put('/:id', controlador.actualizarUsuario);
router.delete('/:id', controlador.eliminarUsuario);

module.exports = router;