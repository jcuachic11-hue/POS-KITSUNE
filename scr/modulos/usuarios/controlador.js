const conexion = require('../../bd/mysql');
const respuestas = require('../../red/respuestas');

exports.listarUsuarios = async (req, res) => {
    try {
        const [rows] = await conexion.query('SELECT id, nombre, usuario, rol, estado FROM usuarios');
        respuestas.success(req, res, rows, 200);
    } catch (err) {
        respuestas.error(req, res, err, 500);
    }
};

exports.crearUsuario = async (req, res) => {
    const { nombre, usuario, password, rol, estado } = req.body;
    try {
        await conexion.query(
            'INSERT INTO usuarios (nombre, password, rol, estado, usuario) VALUES (?, ?, ?, ?, ?)',
            [nombre, usuario, password, rol, parseInt(estado)]
        );
        respuestas.success(req, res, 'Usuario creado', 201);
    } catch (err) {
        respuestas.error(req, res, err, 500);
    }
};

exports.actualizarUsuario = async (req, res) => {
    const { id } = req.params;
    const { nombre, usuario, password, rol, estado } = req.body;
    try {
        let query = 'UPDATE usuarios SET nombre=?, usuario=?, rol=?, estado=? WHERE id=?';
        let params = [nombre, usuario, rol, parseInt(estado), id];

        if (password) {
            query = 'UPDATE usuarios SET nombre=?, usuario=?, password=?, rol=?, estado=? WHERE id=?';
            params = [nombre, usuario, password, rol, parseInt(estado), id];
        }

        await conexion.query(query, params);
        respuestas.success(req, res, 'Usuario actualizado', 200);
    } catch (err) {
        respuestas.error(req, res, err, 500);
    }
};

exports.eliminarUsuario = async (req, res) => {
    const { id } = req.params;
    try {
        await conexion.query('DELETE FROM usuarios WHERE id=?', [id]);
        respuestas.success(req, res, 'Usuario eliminado', 200);
    } catch (err) {
        respuestas.error(req, res, err, 500);
    }
};