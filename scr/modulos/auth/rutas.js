const express = require('express');
const router = express.Router();
const controlador = require('./controlador.js'); 

// captcha 

router.get('/captcha', controlador.obtenerCaptcha); 

// captcha

// ruta token (login)
router.post('/', controlador.login); 

module.exports = router;