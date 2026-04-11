const db = require('../../bd/mysql'); // Importamos tus funciones inteligentes
const respuestas = require('../../red/respuestas');

const TABLA = 'usuarios';

// Listar
exports.listarUsuarios = async (req, res) => {
    try {
        const items = await db.todos(TABLA);
        respuestas.success(req, res, items, 200);
    } catch (err) {
        respuestas.error(req, res, err.message, 500);
    }
};

// Crear o Actualizar (Usando la misma lógica de productos)
exports.crearUsuario = async (req, res) => {
    try {
        // En productos usamos db.agregar(TABLA, req.body)
        // Solo nos aseguramos de que el estado sea número
        if (req.body.estado) req.body.estado = parseInt(req.body.estado);
        
        await db.agregar(TABLA, req.body);
        
        const mensaje = req.body.id ? 'Usuario actualizado' : 'Usuario creado';
        respuestas.success(req, res, mensaje, 201);
    } catch (err) {
        respuestas.error(req, res, err.message, 500);
    }
};

// Como db.agregar ya hace el UPDATE si hay ID, 
// podemos hacer que actualizarUsuario use la misma lógica
exports.actualizarUsuario = async (req, res) => {
    try {
        // Le pegamos el ID de la URL al body para que db.agregar sepa que es UPDATE
        req.body.id = req.params.id;
        if (req.body.estado) req.body.estado = parseInt(req.body.estado);

        await db.agregar(TABLA, req.body);
        respuestas.success(req, res, 'Usuario actualizado', 200);
    } catch (err) {
        respuestas.error(req, res, err.message, 500);
    }
};

// Eliminar
exports.eliminarUsuario = async (req, res) => {
    try {
        await db.eliminar(TABLA, req.params.id);
        respuestas.success(req, res, 'Usuario eliminado', 200);
    } catch (err) {
        respuestas.error(req, res, err.message, 500);
    }
};