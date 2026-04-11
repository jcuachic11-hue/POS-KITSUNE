const conexion = require('../../bd/mysql');
const respuestas = require('../../red/respuestas');

// Listar usuarios
exports.listarUsuarios = async (req, res) => {
    try {
        const [rows] = await conexion.query(
            'SELECT id, nombre, usuario, rol, estado FROM usuarios'
        );
        respuestas.success(req, res, rows, 200);
    } catch (err) {
        respuestas.error(req, res, err, 500);
    }
};

// Crear usuario
exports.crearUsuario = async (req, res) => {
    const { nombre, usuario, password, rol, estado } = req.body;
    try {
        await conexion.query(
            'INSERT INTO usuarios (nombre, password, rol, estado, usuario) VALUES (?, ?, ?, ?, ?)',
            [nombre, password, rol, estado, usuario]
        );
        respuestas.success(req, res, 'Usuario creado correctamente', 201);
    } catch (err) {
        respuestas.error(req, res, err, 500);
    }
};

// Actualizar usuario
exports.actualizarUsuario = async (req, res) => {
    const { id } = req.params;
    const { nombre, usuario, password, rol, estado } = req.body;
    try {
        let query = 'UPDATE usuarios SET nombre=?, rol=?, estado=?, usuario=? WHERE id=?';
        let params = [nombre, rol, estado, usuario, id];

        if (password) {
            query = 'UPDATE usuarios SET nombre=?, password=?, rol=?, estado=?, usuario=? WHERE id=?';
            params = [nombre, password, rol, estado, usuario, id];
        }

        await conexion.query(query, params);
        respuestas.success(req, res, 'Usuario actualizado', 200);
    } catch (err) {
        respuestas.error(req, res, err, 500);
    }
};

// Eliminar usuario
exports.eliminarUsuario = async (req, res) => {
    const { id } = req.params;
    try {
        await conexion.query('DELETE FROM usuarios WHERE id=?', [id]);
        respuestas.success(req, res, 'Usuario eliminado', 200);
    } catch (err) {
        respuestas.error(req, res, err, 500);
    }
};