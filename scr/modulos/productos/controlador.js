const db = require('../../bd/mysql');
const TABLA = 'productos';

function listarProductos() {
    return db.todos(TABLA);
}

function uno(id) {
    return db.uno(TABLA, id);
}

function guardarProducto(body) {
    
    return db.agregar(TABLA, body);
}

function eliminarProducto(id) {
    return db.eliminar(TABLA, id);
}

module.exports = {
    id: (body) => body.id, 
    listarProductos,
    uno,
    guardarProducto,
    eliminarProducto
};