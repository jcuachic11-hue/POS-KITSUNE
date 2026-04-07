const express = require('express');
const router = express.Router();
const controlador = require('./controlador.js'); // 1. Asegúrate del .js
const auth = require('../../middleware/seguridad'); // 2. Verifica esta ruta

// 💡 Quitamos los IF pesados. Si el controlador está bien exportado, 
// Express lo maneja directo. Es más limpio y rápido.

router.post('/', auth.verificarToken, controlador.devolverProducto);
router.get('/', auth.verificarToken, controlador.listarDevoluciones);

module.exports = router;