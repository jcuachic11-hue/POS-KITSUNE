const express = require('express');
const respuestas = require('../../red/respuestas');
const controlador = require('./controlador');

const router = express.Router();

router.get('/', function (req, res) {
    controlador.todos()
        .then((items) => {
            respuestas.success(req, res, items, 200);
        })
        .catch((err) => {
            respuestas.error(req, res, err, 500);
        });
});

// Repite este formato para el resto de tus rutas (uno, eliminar, etc.)
// Asegúrate de NO incluir el middleware de seguridad que causó el error.

module.exports = router;