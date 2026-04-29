const express = require('express');
const router = express.Router();
const controlador = require('./controlador');
const respuestas = require('../../red/respuestas');
const { verificarMiddleware } = require('../../admin'); // Importación de seguridad

// PROTECCIÓN TOTAL
router.use(verificarMiddleware);

// LISTAR
router.get('/', (req, res) => {
    controlador.listarProductos()
        .then((items) => { 
            respuestas.success(req, res, items, 200); 
        })
        .catch((err) => { 
            respuestas.error(req, res, err, 500); 
        });
});

// CONSULTAR UNO 
router.get('/uno', (req, res) => {
    controlador.uno(req.body.id)
        .then((items) => { 
            respuestas.success(req, res, items, 200); 
        })
        .catch((err) => { 
            respuestas.error(req, res, err, 500); 
        });
});

// AGREGAR / EDITAR
router.post('/agregar', (req, res) => {
    controlador.guardarProducto(req.body)
        .then(() => { 
            respuestas.success(req, res, 'Operación exitosa', 201); 
        })
        .catch((err) => { 
            respuestas.error(req, res, err.message, 500); 
        });
});

// ELIMINAR
router.delete('/eliminar', (req, res) => {
    const idParaEliminar = req.body.id; 
    controlador.eliminarProducto(idParaEliminar)
        .then(() => { 
            respuestas.success(req, res, 'Producto eliminado', 200);   
        })
        .catch((err) => { 
            respuestas.error(req, res, err.message, 500); 
        });
});

module.exports = router;