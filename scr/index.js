// IMPORTACIONES 
const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();

// DEFINIR LAS RUTAS
const productos = require('./modulos/productos/rutas');
const usuarios = require('./modulos/usuarios/rutas');
const ventas = require('./modulos/ventas/rutas');
const devoluciones = require('./modulos/devoluciones/rutas');
const authRutas = require('./modulos/auth/rutas');
const promociones = require('./modulos/promociones/rutas');

// MIDDLEWARES
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // <--- ¡Asegúrate de que esté aquí!


app.use('/productos', productos);
app.use('/usuarios', usuarios);
app.use('/ventas', ventas);
app.use('/devoluciones', devoluciones);
app.use('/login', authRutas);
app.use('/promociones', promociones);


app.use(express.static(path.join(__dirname, 'publico')));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Servidor POS Kitsune corriendo en puerto ${PORT}`);
});