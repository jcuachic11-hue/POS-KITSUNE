const db = require('../../bd/mysql'); // Importamos tu capa de base de datos
const jwt = require('jsonwebtoken');
const respuestas = require('../../red/respuestas');
const svgCaptcha = require('svg-captcha'); // Importamos la librería del captcha

// ==========================================
// FUNCIÓN PARA GENERAR CAPTCHA (INICIO)
// ==========================================
async function obtenerCaptcha(req, res) {
    const captcha = svgCaptcha.create({
        size: 6,
        noise: 3,
        color: true,
        background: '#f0f2f5'
    });

    // Guardamos el texto en la sesión para validar después
    req.session.captcha = captcha.text.toLowerCase();
    
    // Enviamos el SVG al frontend
    res.type('svg');
    res.status(200).send(captcha.data);
}
// ==========================================
// FUNCIÓN PARA GENERAR CAPTCHA (FIN)
// ==========================================

async function login(req, res) {
    // Añadimos captchaInput a la destrucción del body
    const { usuario, password, captchaInput } = req.body;

    try {
        // ==========================================
        // VALIDACIÓN DE PURO CAPTCHA (INICIO)
        // ==========================================
        if (!req.session.captcha || !captchaInput || captchaInput.toLowerCase() !== req.session.captcha) {
            return respuestas.error(req, res, 'Código CAPTCHA incorrecto o expirado', 400);
        }
        // Si es correcto, lo eliminamos de la sesión para que no se reutilice
        delete req.session.captcha;
        // ==========================================
        // VALIDACIÓN DE PURO CAPTCHA (FIN)
        // ==========================================

        const user = await db.uno('usuarios', usuario);

        if (!user) {
            return respuestas.error(req, res, 'Usuario no encontrado', 401);
        }

        // Comparación de contraseña
        if (password !== user.password) {
            return respuestas.error(req, res, 'Contraseña incorrecta', 401);
        }

        // Generar Token 
        const token = jwt.sign(
            { id: user.id, usuario: user.usuario, rol: user.rol },
            process.env.JWT_SECRET || 'clave_temporal',
            { expiresIn: '8h' }
        );

        // Respuesta esperando login
        respuestas.success(req, res, { token, usuario: user.usuario }, 200);

    } catch (error) {
        console.error("Error detallado en login:", error);
        respuestas.error(req, res, 'Error interno: ' + error.message, 500);
    }
}

module.exports = { 
    login,
    obtenerCaptcha // No olvides exportarlo para usarlo en tus rutas
};