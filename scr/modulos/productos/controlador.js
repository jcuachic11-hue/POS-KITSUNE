const db = require('../../bd/mysql');
const TABLA = 'productos';

function listarProductos() {
    return db.todos(TABLA);
}

function uno(id) {
    return db.uno(TABLA, id);
}

function guardarProducto(body) {
    // Si el body trae id, db.agregar hará un UPDATE automáticamente
    return db.agregar(TABLA, body);
}

function eliminarProducto(id) {
    return db.eliminar(TABLA, id);
}

module.exports = {
    id: (body) => body.id, // Campo id extraído del body si es necesario
    listarProductos,
    uno,
    guardarProducto,
    eliminarProducto
};