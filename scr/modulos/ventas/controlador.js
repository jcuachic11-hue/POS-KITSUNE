const db = require('../../bd/mysql');
const respuestas = require('../../red/respuestas');

let carrito = []; 

async function agregarCarrito(req, res) {
    try {
        const { idProducto, cantidad, codigoPromo } = req.body; 
        
        // 1. Buscar Producto
        const producto = await db.uno('productos', idProducto);
        if (!producto) {
            return respuestas.error(req, res, 'Producto no encontrado', 404);
        }

        let precioOriginal = parseFloat(producto.precio);
        let porcentajeDescuento = 0;

        // 2. BUSQUEDA DE PROMO (Protegida para que no rompa el flujo)
        if (codigoPromo && codigoPromo.trim() !== "") {
            try {
                // Buscamos por la columna 'codigo'
                const resultados = await db.query('SELECT * FROM promociones WHERE codigo = ?', [codigoPromo.trim()]);
                
                if (resultados && resultados.length > 0) {
                    porcentajeDescuento = parseFloat(resultados[0].valor);
                    console.log(`✅ Promo aplicada: ${codigoPromo} (-${porcentajeDescuento}%)`);
                }
            } catch (promoErr) {
                console.error("Error al buscar promo (posible columna inexistente):", promoErr.message);
                // Si falla la promo, seguimos con descuento 0, pero NO detenemos el proceso
            }
        }

        // 3. Cálculos
        const montoDescuento = precioOriginal * (porcentajeDescuento / 100);
        const precioConDescuento = precioOriginal - montoDescuento;

        const nuevoItem = {
            id: idProducto,
            nombre: producto.nombre,
            precioOriginal: precioOriginal,
            precioVenta: precioConDescuento, 
            descuento: porcentajeDescuento,
            cantidad: parseInt(cantidad),
            subtotal: precioConDescuento * parseInt(cantidad)
        };
        
        carrito.push(nuevoItem);
        respuestas.success(req, res, nuevoItem, 201);

    } catch (err) {
        console.error("Error crítico en agregarCarrito:", err);
        respuestas.error(req, res, 'Error interno del servidor', 500);
    }
}

function listarCarrito(req, res) {
    respuestas.success(req, res, carrito, 200);
}

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
        respuestas.success(req, res, 'Venta realizada', 200);
    } catch (err) {
        respuestas.error(req, res, err.message, 500);
    }
}

module.exports = { agregarCarrito, listarCarrito, totalesCarrito, comprar };