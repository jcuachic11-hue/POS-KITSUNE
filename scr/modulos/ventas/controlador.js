const db = require('../../bd/mysql');
const respuestas = require('../../red/respuestas');

let carrito = []; 

async function agregarCarrito(req, res) {
    try {
        const { idProducto, cantidad } = req.body; 
        const producto = await db.uno('productos', idProducto);

        if (!producto) {
            return respuestas.error(req, res, 'Producto no encontrado', 404);
        }

        const nuevoItem = {
            id: idProducto,
            nombre: producto.nombre,
            precio: producto.precio,
            cantidad: parseInt(cantidad),
            subtotal: producto.precio * parseInt(cantidad)
        };
        
        carrito.push(nuevoItem);
        respuestas.success(req, res, nuevoItem, 201);
    } catch (err) {
        respuestas.error(req, res, err.message, 500);
    }
}

function listarCarrito(req, res) {
    respuestas.success(req, res, carrito, 200);
}

function totalesCarrito(req, res) {
    const total = carrito.reduce((acc, item) => acc + item.subtotal, 0);
    respuestas.success(req, res, { 
        items: carrito.length,
        total: total 
    }, 200);
}

async function comprar(req, res) {
    try {
        if (carrito.length === 0) {
            return respuestas.error(req, res, 'El carrito está vacío', 400);
        }

        for (const item of carrito) {
            await db.restarStock(item.id, item.cantidad);
        }

        carrito = []; // Vaciamos el carrito tras la compra exitosa
        respuestas.success(req, res, 'Venta procesada con éxito', 200);
    } catch (err) {
        respuestas.error(req, res, err.message, 500);
    }
}

module.exports = {
    agregarCarrito,
    listarCarrito,
    totalesCarrito,
    comprar
};