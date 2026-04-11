const conexion = require('../../bd/mysql');
const respuestas = require('../../red/respuestas');

// Listar usuarios
exports.listarUsuarios = async (req, res) => {
    try {
        // Asegúrate de que estas columnas existan tal cual en tu tabla de MySQL
        const [rows] = await conexion.query(
            'SELECT id, nombre, usuario, rol, estado FROM usuarios'
        );
        respuestas.success(req, res, rows, 200);
    } catch (err) {
        console.error("Error en listarUsuarios:", err); // Esto aparecerá en los logs de Railway
        respuestas.error(req, res, err.message || err, 500);
    }
};

// Crear usuario
exports.crearUsuario = async (req, res) => {
    const { nombre, usuario, password, rol, estado } = req.body;
    try {
        await conexion.query(
            'INSERT INTO usuarios (nombre, password, rol, estado, usuario) VALUES (?, ?, ?, ?, ?)',
            [nombre, password, rol, parseInt(estado), usuario]
        );
        respuestas.success(req, res, 'Usuario creado correctamente', 201);
    } catch (err) {
        console.error("Error en crearUsuario:", err);
        respuestas.error(req, res, err.message || err, 500);
    }
};

// Actualizar usuario
exports.actualizarUsuario = async (req, res) => {
    const { id } = req.params;
    const { nombre, usuario, password, rol, estado } = req.body;
    try {
        let query = 'UPDATE usuarios SET nombre=?, usuario=?, rol=?, estado=? WHERE id=?';
        let params = [nombre, usuario, rol, parseInt(estado), id];

        if (password && password.trim() !== "") {
            query = 'UPDATE usuarios SET nombre=?, usuario=?, password=?, rol=?, estado=? WHERE id=?';
            params = [nombre, usuario, password, rol, parseInt(estado), id];
        }

        await conexion.query(query, params);
        respuestas.success(req, res, 'Usuario actualizado', 200);
    } catch (err) {
        console.error("Error en actualizarUsuario:", err);
        respuestas.error(req, res, err.message || err, 500);
    }
};

// Eliminar usuario
exports.eliminarUsuario = async (req, res) => {
    const { id } = req.params;
    try {
        await conexion.query('DELETE FROM usuarios WHERE id=?', [id]);
        respuestas.success(req, res, 'Usuario eliminado', 200);
    } catch (err) {
        console.error("Error en eliminarUsuario:", err);
        respuestas.error(req, res, err.message || err, 500);
    }
};