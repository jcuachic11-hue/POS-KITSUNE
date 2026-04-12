const db = require('../../bd/mysql');
const respuestas = require('../../red/respuestas');

let carrito = []; 

function agregarCarrito(req, res) {
    // Usamos idProducto para que coincida con tu HTML
    const { idProducto, precio, cantidad } = req.body; 
    
    carrito.push({
        id: idProducto, // Lo guardamos como 'id' para que el bucle lo encuentre
        precio: parseFloat(precio),
        cantidad: parseInt(cantidad)
    });
    
    respuestas.success(req, res, 'Producto añadido al carrito', 201);
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
        if (carrito.length === 0) {
            return respuestas.error(req, res, 'El carrito está vacío', 400);
        }

        for (const item of carrito) {
            // Usamos la nueva función que creamos en mysql.js
            // Esto resta directamente en la tabla de Railway
            await db.restarStock(item.id, item.cantidad);
        }

        carrito = []; 
        respuestas.success(req, res, 'Venta realizada y stock restado en Railway', 200);

    } catch (err) {
        console.error("Error en la venta:", err);
        respuestas.error(req, res, 'Error al procesar la compra', 500);
    }
}

module.exports = {
    agregarCarrito,
    listarCarrito,
    totalesCarrito,
    comprar
};