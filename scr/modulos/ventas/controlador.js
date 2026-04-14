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

        // Búsqueda de promoción
        if (codigoPromo && codigoPromo.trim() !== "") {
            try {
                const promos = await db.query('SELECT * FROM promociones WHERE codigo = ?', [codigoPromo.trim()]);
                if (promos && promos.length > 0) {
                    porcentajeDescuento = parseFloat(promos[0].valor);
                }
            } catch (err) {
                console.log("Error consultando promo.");
            }
        }

        // LÓGICA DE LA RESTA
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

// Esta función la pide tu ruta GET /carrito
function listarCarrito(req, res) {
    respuestas.success(req, res, carrito, 200);
}

// Esta función la pide tu ruta GET /totales
function totalesCarrito(req, res) {
    const total = carrito.reduce((acc, item) => acc + item.subtotal, 0);
    respuestas.success(req, res, { items: carrito.length, total: total.toFixed(2) }, 200);
}

async function comprar(req, res) {
    try {
        if (carrito.length === 0) return respuestas.error(req, res, 'Carrito vacío', 400);
        for (const item of carrito) {
            await db.restarStock(item.id, item.cantidad);
        }
        carrito = []; 
        respuestas.success(req, res, 'Venta finalizada', 200);
    } catch (err) {
        respuestas.error(req, res, err.message, 500);
    }
}

// EXPORTS EXACTOS PARA TUS RUTAS
module.exports = { 
    agregarCarrito, 
    listarCarrito, 
    totalesCarrito, 
    comprar 
};