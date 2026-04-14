const db = require('../../bd/mysql');
const respuestas = require('../../red/respuestas');

let carrito = []; 

async function agregarCarrito(req, res) {
    try {
        const { idProducto, cantidad } = req.body; 
        
        // Buscamos el producto en la BD para obtener el precio y nombre
        const producto = await db.uno('productos', idProducto);

        if (!producto) {
            return respuestas.error(req, res, 'Producto no encontrado', 404);
        }

        // Creamos el objeto con la información completa
        const nuevoItem = {
            id: idProducto,
            nombre: producto.nombre,
            precio: producto.precio, // <--- Aquí jalamos el precio
            cantidad: parseInt(cantidad),
            subtotal: producto.precio * parseInt(cantidad)
        };
        
        carrito.push(nuevoItem);
        
        console.log("Producto agregado. Carrito actual:", carrito);
        
        // Devolvemos el objeto completo para que el HTML muestre el precio
        respuestas.success(req, res, nuevoItem, 201);

    } catch (err) {
        console.error("Error al agregar al carrito:", err);
        respuestas.error(req, res, 'Error al obtener datos del producto', 500);
    }
}

function listarCarrito(req, res) {
    respuestas.success(req, res, carrito, 200);
}

// Función para calcular los totales reales del carrito
function totalesCarrito(req, res) {
    const total = carrito.reduce((acc, item) => acc + item.subtotal, 0);
    respuestas.success(req, res, { 
        items: carrito.length,
        total: total 
    }, 200);
}

async function comprar(req, res) {
    try {
        console.log("Intentando procesar compra. Items:", carrito.length);

        if (carrito.length === 0) {
            return respuestas.error(req, res, 'El carrito está vacío', 400);
        }

        for (const item of carrito) {
            console.log(`Restando ${item.cantidad} al producto ID: ${item.id}`);
            await db.restarStock(item.id, item.cantidad);
        }

        carrito = []; 
        respuestas.success(req, res, 'Venta procesada con éxito', 200);

    } catch (err) {
        console.error("ERROR CRÍTICO EN COMPRA:", err);
        respuestas.error(req, res, 'Error en el servidor: ' + err.message, 500);
    }
}

module.exports = {
    agregarCarrito,
    listarCarrito,
    totalesCarrito,
    comprar
};