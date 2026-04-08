const conexion = require('../../db/mysql'); 
const jwt = require('jsonwebtoken');
const respuestas = require('../../red/respuestas');

async function login(req, res) {
    const { usuario, password } = req.body;
    try {
        const [rows] = await conexion.query(
            'SELECT * FROM usuarios WHERE usuario = ?',
            [usuario]
        );

        if (rows.length === 0) {
            return respuestas.error(req, res, 'Usuario no encontrado', 401);
        }

        const user = rows[0];

        // Comparación directa (sin bcrypt por ahora)
        if (password !== user.password) {
            return respuestas.error(req, res, 'Contraseña incorrecta', 401);
        }

        const token = jwt.sign(
            { id: user.id, usuario: user.usuario, rol: user.rol },
            process.env.JWT_SECRET || 'clave_temporal',
            { expiresIn: '8h' }
        );

        // Enviamos la respuesta estructurada que espera el HTML
        respuestas.success(req, res, { token, usuario: user.usuario }, 200);

    } catch (error) {
        respuestas.error(req, res, 'Error interno', 500);
    }
}

module.exports = { login };