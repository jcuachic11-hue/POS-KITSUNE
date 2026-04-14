const db = require('../../bd/mysql');
const respuestas = require('../../red/respuestas');
// Importamos el pool directamente para hacer la consulta exacta sin pasar por la lógica de 'uno'
const mysql = require('mysql2/promise'); 

let carrito = []; 

async function agregarCarrito(req, res) {
    try {
        const { idProducto, cantidad, codigoPromo } = req.body; 
        
        // 1. Obtener producto (esto funciona bien porque el ID es número)
        const producto = await db.uno('productos', idProducto);
        if (!producto) return respuestas.error(req, res, 'Producto no encontrado', 404);

        let precioBase = parseFloat(producto.precio);
        let porcentajeDescuento = 0;

        // 2. BUSCAR PROMO (Corregido para no usar db.uno)
        if (codigoPromo && codigoPromo.trim() !== "") {
            // Buscamos directamente en la tabla promociones donde el código coincida
            // Usamos db.todos o una consulta directa para saltarnos el error de la columna 'usuario'
            const todasPromos = await db.todos('promociones');
            const promoEncontrada = todasPromos.find(p => p.codigo === codigoPromo.trim());

            if (promoEncontrada) {
                // Aquí usamos 'valor'. Si tu columna se llama diferente, cámbialo aquí.
                porcentajeDescuento = parseFloat(promoEncontrada.valor || 0);
            }
        }

        // 3. LA RESTA
        const precioVenta = precioBase - (precioBase * (porcentajeDescuento / 100));
        const subtotal = precioVenta * parseInt(cantidad);

        const nuevoItem = {
            id: idProducto,
            nombre: producto.nombre,
            precioOriginal: precioBase,
            precioVenta: precioVenta, 
            descuento: porcentajeDescuento,
            cantidad: parseInt(cantidad),
            subtotal: subtotal 
        };
        
        carrito.push(nuevoItem);
        return respuestas.success(req, res, nuevoItem, 201);

    } catch (err) {
        console.error(err);
        return respuestas.error(req, res, 'Error interno', 500);
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
        for (const item of carrito) {
            await db.restarStock(item.id, item.cantidad);
        }
        carrito = []; 
        respuestas.success(req, res, 'Venta finalizada', 200);
    } catch (err) {
        respuestas.error(req, res, err.message, 500);
    }
}

module.exports = { agregarCarrito, listarCarrito, totalesCarrito, comprar };