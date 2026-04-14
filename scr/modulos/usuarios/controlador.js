const db = require('../../bd/mysql');
const respuestas = require('../../red/respuestas');

const TABLA = 'usuarios';

// Listar Usuarios
exports.listarUsuarios = async (req, res) => {
    try {
        const items = await db.todos(TABLA);
        respuestas.success(req, res, items, 200);
    } catch (err) {
        respuestas.error(req, res, err.message, 500);
    }
};

// Crear Usuario (POST)
exports.crearUsuario = async (req, res) => {
    try {
       
        if (req.body.estado) req.body.estado = parseInt(req.body.estado);

        
        await db.agregar(TABLA, req.body);
        
        respuestas.success(req, res, 'Usuario guardado', 201);
    } catch (err) {
        console.error("Error en MySQL:", err.sqlMessage || err);
        respuestas.error(req, res, err.sqlMessage || 'Error al insertar', 500);
    }
};

// Actualizar Usuario (PUT)
exports.actualizarUsuario = async (req, res) => {
    try {
        
        req.body.id = req.params.id;
        if (req.body.estado) req.body.estado = parseInt(req.body.estado);

        await db.agregar(TABLA, req.body);
        respuestas.success(req, res, 'Usuario actualizado', 200);
    } catch (err) {
        respuestas.error(req, res, err.message, 500);
    }
};

// Eliminar Usuario
exports.eliminarUsuario = async (req, res) => {
    try {
        await db.eliminar(TABLA, req.params.id);
        respuestas.success(req, res, 'Usuario eliminado', 200);
    } catch (err) {
        respuestas.error(req, res, err.message, 500);
    }
};