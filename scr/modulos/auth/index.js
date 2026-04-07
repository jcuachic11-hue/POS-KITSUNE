const db = require('../../bd/mysql');   // conexión a la base de datos
const ctrl = require('./controlador');  // controlador de auth
const rutas = require('./rutas');       // rutas de auth





//  DB en el controlador
const controlador = ctrl(db);

module.exports = rutas;




