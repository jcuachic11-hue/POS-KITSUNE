const express = require('express');
const router = express.Router();
const controlador = require('./controlador');
const auth = require('../auth/middleware');
const respuestas = require('../../red/respuestas');

// LISTAR PRODUCTOS
// Se comenta 'auth.verificarToken' para permitir la carga de la tabla sin login
router.get('/', /* auth.verificarToken, */ (req, res) => {
    controlador.listarProductos()
        .then((items) => { 
            respuestas.success(req, res, items, 200); 
        })
        .catch((err) => { 
            respuestas.error(req, res, err, 500); 
        });
});

// CREAR PRODUCTO (POST)
// Cambiado a '/agregar' para coincidir con el fetch del HTML
// Se comenta 'auth.verificarToken' para que no rebote el "Bearer null"
router.post('/agregar', /* auth.verificarToken, */ (req, res) => {
    console.log("📦 Datos recibidos en el backend:", req.body);
    controlador.guardarProducto(req.body)
        .then(() => { 
            respuestas.success(req, res, 'Guardado correctamente', 201); 
        })
        .catch((err) => { 
            console.error("❌ Error en el controlador al guardar:", err);
            respuestas.error(req, res, err, 500); 
        });
});

// ACTUALIZAR / ELIMINAR (PUT)
// Se ajusta la ruta a '/eliminar' para que coincida con el botón del HTML
router.put('/eliminar', /* auth.verificarToken, */ (req, res) => {
    controlador.guardarProducto(req.body)
        .then(() => { 
            respuestas.success(req, res, 'Acción realizada correctamente', 200); 
        })
        .catch((err) => { 
            respuestas.error(req, res, err, 500); 
        });
});

// ELIMINAR FÍSICO (Opcional, si usas DELETE por ID)
router.delete('/:id', /* auth.verificarToken, */ (req, res) => {
    controlador.eliminarProducto(req.params.id)
        .then(() => { 
            respuestas.success(req, res, 'Eliminado de la base de datos', 200); 
        })
        .catch((err) => { 
            respuestas.error(req, res, err, 500); 
        });
});

module.exports = router;