const express = require('express');
const router = express.Router();
const controlador = require('./controlador');
const { verificarMiddleware } = require('../admin'); 

router.use(verificarMiddleware); 


router.post('/', controlador.devolverProducto); 
router.get('/', controlador.listarDevoluciones);

module.exports = router;