const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

const session = require('express-session'); //para captcha

// --- MIDDLEWARES ---
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(express.static(path.join(__dirname, 'publico')));

app.use(session({ //captcha 

    // Si process.env.SESSION_SECRET no existe, usa la frase de la derecha
    secret: process.env.SESSION_SECRET || 'clave_de_emergencia_kitsune_123', 
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

const productos = require('./modulos/productos/rutas');
const usuarios = require('./modulos/usuarios/rutas');
const ventas = require('./modulos/ventas/rutas');
const devoluciones = require('./modulos/devoluciones/rutas');
const authRutas = require('./modulos/auth/rutas');
const promociones = require('./modulos/promociones/rutas');

// --- ENDPOINTS ---
app.use('/productos', productos);
app.use('/usuarios', usuarios);
app.use('/ventas', ventas);
app.use('/devoluciones', devoluciones);
app.use('/login', authRutas);
app.use('/promociones', promociones);

// --- PUERTO ---
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(` Servidor POS Kitsune corriendo en puerto ${PORT}`);
});
