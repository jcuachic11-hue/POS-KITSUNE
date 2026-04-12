const db = require('../../bd/mysql');
const respuestas = require('../../red/respuestas');

let carrito = []; 

function agregarCarrito(req, res) {
    // Tu lógica de agregar
    respuestas.success(req, res, 'Agregado', 201);
}

function listarCarrito(req, res) {
    respuestas.success(req, res, carrito, 200);
}

function totalesCarrito(req, res) {
    const total = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
    respuestas.success(req, res, { total }, 200);
}

async function comprar(req, res) {
    try {
        for (const item of carrito) {
            const productoDB = await db.uno('productos', item.id);
            if (productoDB) {
                const nuevoStock = productoDB.stock - item.cantidad;
                await db.agregar('productos', { id: item.id, stock: nuevoStock });
            }
        }
        carrito = []; 
        respuestas.success(req, res, 'Venta realizada', 200);
    } catch (err) {
        respuestas.error(req, res, err.message, 500);
    }
}

// EXPORTACIÓN CORRECTA
module.exports = {
    agregarCarrito,
    listarCarrito,
    totalesCarrito,
    comprar
};