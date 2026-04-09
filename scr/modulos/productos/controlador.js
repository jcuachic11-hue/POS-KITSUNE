const db = require('../../bd/mysql');
const TABLA = 'productos';

function listarProductos() {
    return db.todos(TABLA);
}

function uno(id) {
    return db.uno(TABLA, id);
}

function guardarProducto(body) {
    // En tu sistema, "agregar" sirve para INSERT y UPDATE
    return db.agregar(TABLA, body);
}

function eliminarProducto(id) {
    return db.eliminar(TABLA, id);
}

module.exports = {
    listarProductos,
    uno,
    guardarProducto,
    eliminarProducto
};