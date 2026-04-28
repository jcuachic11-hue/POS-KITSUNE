const db = require('../../bd/mysql'); 
const respuestas = require('../../red/respuestas');
const svgCaptcha = require('svg-captcha'); 

async function obtenerCaptcha(req, res) {
    const captcha = svgCaptcha.create({
        size: 6,
        noise: 3,
        color: true,
        background: '#f0f2f5'
    });

    req.session.captcha = captcha.text.toLowerCase();
    
    res.type('svg');
    res.status(200).send(captcha.data);
}

async function login(req, res) {
    const { usuario, password, captchaInput } = req.body;

    try {
        
        if (!req.session.captcha || !captchaInput || captchaInput.toLowerCase() !== req.session.captcha) {
            return respuestas.error(req, res, 'Código CAPTCHA incorrecto o expirado', 400);
        }
        
        delete req.session.captcha;

      
        const user = await db.uno('usuarios', usuario);
        if (!user) {
            return respuestas.error(req, res, 'Usuario no encontrado', 401);
        }

        
        if (password !== user.password) {
            return respuestas.error(req, res, 'Contraseña incorrecta', 401);
        }

        
        res.cookie('mi_token_pos', 'USUARIO_VALIDO_ABC', {
            httpOnly: false,    
            secure: true,       
            sameSite: 'none',   
            path: '/',
            maxAge: 1000 * 60 * 60 * 8 // 8 horas
        });

        
        respuestas.success(req, res, { mensaje: 'Acceso concedido', usuario: user.usuario }, 200);

    } catch (error) {
        console.error("Error detallado en login:", error);
        respuestas.error(req, res, 'Error interno: ' + error.message, 500);
    }
}

module.exports = { 
    login,
    obtenerCaptcha 
};