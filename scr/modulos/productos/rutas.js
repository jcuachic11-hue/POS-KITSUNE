const express = require('express');
const router = express.Router();
const controlador = require('./controlador');
const respuestas = require('../../red/respuestas');

// GET /productos -> Lista todo
router.get('/', (req, res) => {
    controlador.listarProductos()
        .then((items) => { 
            respuestas.success(req, res, items, 200); 
        })
        .catch((err) => { 
            respuestas.error(req, res, err, 500); 
        });
});

// POST /productos/agregar -> Guarda o Edita
router.post('/agregar', (req, res) => {
    controlador.guardarProducto(req.body)
        .then(() => { 
            respuestas.success(req, res, 'Guardado correctamente', 201); 
        })
        .catch((err) => { 
            respuestas.error(req, res, err.message, 500); 
        });
});

// DELETE /productos/eliminar -> Borra de la DB
router.delete('/eliminar', (req, res) => {
    const idParaEliminar = req.body.id; 
    controlador.eliminarProducto(idParaEliminar)
        .then(() => { 
            respuestas.success(req, res, 'Eliminado con éxito', 200); 
        })
        .catch((err) => { 
            respuestas.error(req, res, err.message, 500); 
        });
});

module.exports = router;
