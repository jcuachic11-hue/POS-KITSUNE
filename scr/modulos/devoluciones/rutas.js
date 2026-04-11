/*/const express = require('express');
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

module.exports = router;*/

const express = require('express');
const router = express.Router();
const controlador = require('./controlador');
const respuestas = require('../../red/respuestas');

// LISTAR PRODUCTOS (GET)
router.get('/', (req, res) => {
    controlador.listarProductos()
        .then((items) => { 
            respuestas.success(req, res, items, 200); 
        })
        .catch((err) => { 
            respuestas.error(req, res, err, 500); 
        });
});

// AGREGAR O ACTUALIZAR (POST)
// Usamos POST para ambos porque el controlador decide según el ID
router.post('/agregar', (req, res) => {
    console.log("--- PETICIÓN DE GUARDADO/EDICIÓN ---");
    console.log("Body:", req.body);

    controlador.guardarProducto(req.body)
        .then(() => { 
            respuestas.success(req, res, 'Operación exitosa', 201); 
        })
        .catch((err) => { 
            console.error("❌ ERROR AL GUARDAR:", err);
            respuestas.error(req, res, err.message || 'Error interno', 500); 
        });
});

// ELIMINAR (DELETE)
router.delete('/eliminar', (req, res) => {
    console.log("--- PETICIÓN DE ELIMINACIÓN ---");
    const idParaEliminar = req.body.id; 

    controlador.eliminarProducto(idParaEliminar)
        .then(() => { 
            respuestas.success(req, res, 'Producto eliminado', 200); 
        })
        .catch((err) => { 
            console.error("❌ ERROR AL ELIMINAR:", err);
            respuestas.error(req, res, err.message || err, 500); 
        });
});

module.exports = router;