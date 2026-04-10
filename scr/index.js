const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// --- MIDDLEWARES ---
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- SERVIR ARCHIVOS ESTÁTICOS ---
// Usamos path.join(__dirname, 'publico') porque index.js está DENTRO de scr.
// Esto buscará los archivos en scr/publico/
app.use(express.static(path.join(__dirname, 'publico')));

// --- IMPORTACIÓN DE RUTAS ---
// Al estar en scr/index.js, las rutas están en ./modulos/...
const productos = require('./modulos/productos/rutas');
const usuarios = require('./modulos/usuarios/rutas');
const ventas = require('./modulos/ventas/rutas');
const devoluciones = require('./modulos/devoluciones/rutas');
const authRutas = require('./modulos/auth/rutas');

// --- ENDPOINTS ---
app.use('/productos', productos);
app.use('/usuarios', usuarios);
app.use('/ventas', ventas);
app.use('/devoluciones', devoluciones);
app.use('/login', authRutas);

// --- PUERTO ---
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`🚀 Servidor POS Kitsune corriendo en puerto ${PORT}`);
});
