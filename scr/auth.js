//por si uso tokens
const jwt = require('jsonwebtoken');
const respuestas = require('./red/respuestas'); // Ruta corregida según tu estructura

const claveSecreta = process.env.JWT_SECRET || 'clave_secreta_local';

function verificarToken(req, res, next) {
    const header = req.headers['authorization'];
    if (!header) return respuestas.error(req, res, 'Acceso denegado: No hay token', 401);

    const token = header.split(' ')[1];
    jwt.verify(token, claveSecreta, (err, decoded) => {
        if (err) return respuestas.error(req, res, 'Sesión inválida o expirada', 401);
        req.usuario = decoded;
        next();
    });
}

module.exports = { verificarToken, claveSecreta };