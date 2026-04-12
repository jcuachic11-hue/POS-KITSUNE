const db = require('../../bd/mysql');
const respuestas = require('../../red/respuestas');

let carrito = []; 

function agregarCarrito(req, res) {
    // Extraemos con los nombres exactos que vienen del HTML
    const { idProducto, cantidad } = req.body; 
    
    // Lo guardamos en el carrito con nombres claros
    carrito.push({
        id: idProducto, 
        cantidad: parseInt(cantidad)
    });
    
    console.log("Producto agregado. Carrito actual:", carrito);
    respuestas.success(req, res, 'Producto añadido al carrito', 201);
}

function listarCarrito(req, res) {
    respuestas.success(req, res, carrito, 200);
}

async function comprar(req, res) {
    try {
        console.log("Intentando procesar compra. Items:", carrito.length);

        if (carrito.length === 0) {
            return respuestas.error(req, res, 'El carrito está vacío', 400);
        }

        for (const item of carrito) {
            console.log(`Restando ${item.cantidad} al producto ID: ${item.id}`);
            
            // Llamamos a la función de mysql.js
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
    totalesCarrito: (req, res) => respuestas.success(req, res, { msg: "ok" }, 200),
    comprar
};