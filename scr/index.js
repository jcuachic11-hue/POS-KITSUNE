const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static('scr/publico')); // Para servir tus HTML automáticamente

// Importación de Rutas (Ajustadas a tu estructura de carpetas)
const productos = require('./modulos/productos/rutas');
const usuarios = require('./modulos/usuarios/rutas');
const ventas = require('./modulos/ventas/rutas');
const devoluciones = require('./modulos/devoluciones/rutas');
const authRutas = require('./modulos/auth/rutas'); // Necesitas un archivo de rutas para el login

// Definición de Endpoints
app.use('/productos', productos);
app.use('/usuarios', usuarios);
app.use('/ventas', ventas);
app.use('/devoluciones', devoluciones);
app.use('/login', authRutas); // El login suele ir directo o bajo /auth/login

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor POS Kitsune corriendo en puerto ${PORT}`);
});