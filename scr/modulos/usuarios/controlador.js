const conexion = require('../../bd/mysql');

// Listar usuarios
exports.listarUsuarios = async (req, res) => {
    try {
        const [rows] = await conexion.query(
            'SELECT id, nombre, usuario, rol, estado FROM usuarios'
        );
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err });
    }
};

// Crear usuario
exports.crearUsuario = async (req, res) => {
    const { nombre, usuario, password, rol, estado } = req.body;
    try {
        
        const [result] = await conexion.query(
            'INSERT INTO usuarios (nombre, password, rol, estado, usuario) VALUES (?, ?, ?, ?, ?)',
            [nombre, password, rol, estado, usuario]
        );
        res.json({ id: result.insertId, nombre, usuario, rol, estado });
    } catch (err) {
        res.status(500).json({ error: err });
    }
};

// Actualizar usuario
exports.actualizarUsuario = async (req, res) => {
    const { id } = req.params;
    const { nombre, usuario, password, rol, estado } = req.body;
    try {
        await conexion.query(
            'UPDATE usuarios SET nombre=?, password=?, rol=?, estado=?, usuario=? WHERE id=?',
            [nombre, password, rol, estado, usuario, id]
        );
        res.json({ id, nombre, usuario, rol, estado });
    } catch (err) {
        res.status(500).json({ error: err });
    }
};

// Eliminar usuario
exports.eliminarUsuario = async (req, res) => {
    const { id } = req.params;
    try {
        await conexion.query('DELETE FROM usuarios WHERE id=?', [id]);
        res.json({ mensaje: 'Usuario eliminado' });
    } catch (err) {
        res.status(500).json({ error: err });
    }
};
