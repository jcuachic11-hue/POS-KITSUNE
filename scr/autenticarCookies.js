const express = require('express');
const router = express.Router();

// Ruta para el formulario de login (GET)
router.get('/login', (req, res) => {
    res.send('<form action="/login" method="POST"> <input name="user"> <input name="pass"> <button>Entrar</button> </form>');
});

// Ruta que procesa los datos (POST)
router.post('/login', (req, res) => {
    const { user, pass } = req.body;

    // Validación súper simple
    if (user === 'admin' && pass === '1234') {
        // CREAMOS LA COOKIE
        res.cookie('mi_token_pos', 'USUARIO_VALIDO_ABC', {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 1000 * 60 * 60 // Expira en 1 hora
        });
        res.send('Login exitoso. <a href="/admin/panel">Ir al panel secreto</a>');
    } else {
        res.send('Usuario incorrecto');
    }
});

// Ruta para salir
router.get('/logout', (req, res) => {
    res.clearCookie('mi_token_pos');
    res.send('Sesión cerrada. <a href="/login">Volver a entrar</a>');
});

module.exports = router;