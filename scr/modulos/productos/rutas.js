const express = require('express');
const router = express.Router();
const controlador = require('./controlador');
const auth = require('../auth/middleware');
const respuestas = require('../../red/respuestas');

// LISTAR PRODUCTOS
router.get('/', (req, res) => {
    controlador.listarProductos()
        .then((items) => { 
            respuestas.success(req, res, items, 200); 
        })
        .catch((err) => { 
            respuestas.error(req, res, err, 500); 
        });
});

// CREAR PRODUCTO (POST) - AQUÍ ES DONDE AGREGAMOS EL "RASTREO"
router.post('/agregar', (req, res) => {
    // 1. Esto nos dirá si el HTML está enviando los datos bien
    console.log("--- INTENTO DE GUARDAR PRODUCTO ---");
    console.log("Datos recibidos (body):", req.body);

    controlador.guardarProducto(req.body)
        .then(() => { 
            console.log("✅ Producto guardado con éxito en la DB");
            respuestas.success(req, res, 'Guardado correctamente', 201); 
        })
        .catch((err) => { 
            // 2. Esto nos dirá el error EXACTO de MySQL o del código
            console.error("❌ ERROR DETALLADO AL GUARDAR:", err); 
            
            // Enviamos el mensaje de error real al navegador para no adivinar
            respuestas.error(req, res, err.message || 'Error interno', 500); 
        });
});

// --- ELIMINAR ---
router.delete('/eliminar', (req, res) => {
    console.log("--- INTENTO DE ELIMINAR ---");
    console.log("Cuerpo recibido:", req.body);

    // Extraemos el id del body para que el controlador reciba solo el número
    const idParaEliminar = req.body.id; 

    controlador.eliminarProducto(idParaEliminar)
        .then(() => { 
            respuestas.success(req, res, 'Eliminado con éxito', 200); 
        })
        .catch((err) => { 
            console.error("❌ ERROR AL ELIMINAR:", err);
            respuestas.error(req, res, err.message || err, 500); 
        });
});

module.exports = router;