const db = require('../../bd/mysql');
const respuestas = require('../../red/respuestas');

let carrito = []; 

async function agregarCarrito(req, res) {
    try {
        const { idProducto, cantidad, codigoPromo } = req.body; 
        
        const producto = await db.uno('productos', idProducto);
        if (!producto) return respuestas.error(req, res, 'Producto no encontrado', 404);

        let precioBase = parseFloat(producto.precio);
        let porcentajeDescuento = 0;

        // BÚSQUEDA DE PROMO
        if (codigoPromo && codigoPromo.trim() !== "") {
            try {
                const promos = await db.query('SELECT * FROM promociones WHERE codigo = ?', [codigoPromo.trim()]);
                if (promos && promos.length > 0) {
                    porcentajeDescuento = parseFloat(promos[0].valor);
                }
            } catch (err) {
                console.log("Error en promo, siguiendo sin descuento.");
            }
        }

        // --- LA RESTA ---
        const precioConDescuento = precioBase * (1 - (porcentajeDescuento / 100));
        const subtotalCalculado = precioConDescuento * parseInt(cantidad);

        const nuevoItem = {
            id: idProducto,
            nombre: producto.nombre,
            precioOriginal: precioBase,
            precioVenta: precioConDescuento, 
            descuento: porcentajeDescuento,
            cantidad: parseInt(cantidad),
            subtotal: subtotalCalculado 
        };
        
        carrito.push(nuevoItem);
        return respuestas.success(req, res, nuevoItem, 201);
    } catch (err) {
        return respuestas.error(req, res, 'Error interno', 500);
    }
}

// Esta función es la que pide tu rutas.js en la línea 8
async function todos(req, res) {
    respuestas.success(req, res, carrito, 200);
}

async function eliminar(req, res) {
    carrito = [];
    respuestas.success(req, res, 'Carrito vaciado', 200);
}

async function comprar(req, res) {
    try {
        if (carrito.length === 0) return respuestas.error(req, res, 'Carrito vacío', 400);
        for (const item of carrito) {
            await db.restarStock(item.id, item.cantidad);
        }
        carrito = []; 
        respuestas.success(req, res, 'Venta realizada', 200);
    } catch (err) {
        respuestas.error(req, res, err.message, 500);
    }
}

// --- EXPORTS CORREGIDOS PARA NO CRASHEAR ---
module.exports = {
    todos,          // Para la línea 8 de tus rutas
    agregarCarrito, // Para el POST
    comprar,        // Para finalizar
    eliminar        // Por si tus rutas lo piden como 'eliminar'
};