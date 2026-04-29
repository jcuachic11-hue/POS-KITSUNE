const express = require('express');
const router = express.Router();
const controlador = require('./controlador');
const { verificarMiddleware } = require('../../admin'); 


router.use(verificarMiddleware);

router.get('/', controlador.listarPromociones);
router.get('/:codigo', controlador.obtenerPromocion); 
router.post('/', controlador.crearPromocion);
router.delete('/:id', controlador.eliminarPromocion);
router.put('/', controlador.actualizarPromocion);

module.exports = router;