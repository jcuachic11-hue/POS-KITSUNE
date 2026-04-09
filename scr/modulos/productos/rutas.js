const express = require('express');
const router = express.Router();
const controlador = require('./controlador');
const auth = require('../auth/middleware');
const respuestas = require('../../red/respuestas');

// LISTAR
router.get('/', auth.verificarToken, (req, res) => {
    controlador.listarProductos()
        .then((items) => { respuestas.success(req, res, items, 200); })
        .catch((err) => { respuestas.error(req, res, err, 500); });
});

// CREAR (POST)
router.post('/', auth.verificarToken, (req, res) => {
    controlador.guardarProducto(req.body)
        .then(() => { respuestas.success(req, res, 'Guardado correctamente', 201); })
        .catch((err) => { respuestas.error(req, res, err, 500); });
});

// ACTUALIZAR (PUT)
router.put('/:id', auth.verificarToken, (req, res) => {
    // Combinamos el ID de la URL con los datos del cuerpo
    const data = { ...req.body, id: req.params.id };
    controlador.guardarProducto(data)
        .then(() => { respuestas.success(req, res, 'Actualizado correctamente', 200); })
        .catch((err) => { respuestas.error(req, res, err, 500); });
});

// ELIMINAR
router.delete('/:id', auth.verificarToken, (req, res) => {
    controlador.eliminarProducto(req.params.id)
        .then(() => { respuestas.success(req, res, 'Eliminado', 200); })
        .catch((err) => { respuestas.error(req, res, err, 500); });
});

module.exports = router;