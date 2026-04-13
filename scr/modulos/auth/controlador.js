const db = require('../../bd/mysql'); // Importamos tu capa de base de datos
const jwt = require('jsonwebtoken');
const respuestas = require('../../red/respuestas');

async function login(req, res) {
    const { usuario, password } = req.body;
    try {
        // ERROR ANTERIOR: conexion.query no existe aquí.
        // SOLUCIÓN: Usamos db.uno para buscar al usuario por su nombre.
        const user = await db.uno('usuarios', usuario);

        if (!user) {
            return respuestas.error(req, res, 'Usuario no encontrado', 401);
        }

        // Comparación de contraseña (texto plano)
        if (password !== user.password) {
            return respuestas.error(req, res, 'Contraseña incorrecta', 401);
        }

        // Generar Token (Asegúrate que en Railway sea JWT_SECRET con W)
        const token = jwt.sign(
            { id: user.id, usuario: user.usuario, rol: user.rol },
            process.env.JWT_SECRET || 'clave_temporal',
            { expiresIn: '8h' }
        );

        // Respuesta que espera tu login.html
        respuestas.success(req, res, { token, usuario: user.usuario }, 200);

    } catch (error) {
        console.error("Error detallado en login:", error);
        respuestas.error(req, res, 'Error interno: ' + error.message, 500);
    }
}

module.exports = { login };