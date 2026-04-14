const express = require('express');
const router = express.Router();
const controlador = require('./controlador');
// const auth = require('../../auth'); 

router.get('/', controlador.listarPromociones);
router.get('/:codigo', controlador.obtenerPromocion); // Para buscar en ventas
router.post('/', controlador.crearPromocion);
router.delete('/:id', controlador.eliminarPromocion);
router.put('/', controlador.actualizarPromocion);

module.exports = router;
