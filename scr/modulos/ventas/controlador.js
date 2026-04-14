const db = require('../../bd/mysql');
const respuestas = require('../../red/respuestas');

let carrito = []; 

async function agregarCarrito(req, res) {
    try {
        const { idProducto, cantidad, codigoPromo } = req.body; 
        const producto = await db.uno('productos', idProducto);
        
        if (!producto) return respuestas.error(req, res, 'Producto no encontrado', 404);

        let precioBase = parseFloat(producto.precio);
        let descuentoPorcentaje = 0;

        // BUSCAR PROMO
        if (codigoPromo && codigoPromo.trim() !== "") {
            // Importante: Revisa que tu tabla tenga la columna 'codigo' y 'valor'
            const promos = await db.query('SELECT * FROM promociones WHERE codigo = ?', [codigoPromo.trim()]);
            if (promos && promos.length > 0) {
                descuentoPorcentaje = parseFloat(promos[0].valor); 
            }
        }

        // CÁLCULO DE LA RESTA
        const descuentoMonto = precioBase * (descuentoPorcentaje / 100);
        const precioFinalUnitario = precioBase - descuentoMonto;
        const subtotalCalculado = precioFinalUnitario * parseInt(cantidad);

        const nuevoItem = {
            id: idProducto,
            nombre: producto.nombre,
            precioOriginal: precioBase,
            precioVenta: precioFinalUnitario, // ESTE es el que debe mostrar el HTML
            descuento: descuentoPorcentaje,
            cantidad: parseInt(cantidad),
            subtotal: subtotalCalculado 
        };
        
        carrito.push(nuevoItem);
        return respuestas.success(req, res, nuevoItem, 201);
    } catch (err) {
        return respuestas.error(req, res, 'Error en servidor', 500);
    }
}

function listarCarrito(req, res) {
    respuestas.success(req, res, carrito, 200);
}

function totalesCarrito(req, res) {
    const totalVenta = carrito.reduce((acc, item) => acc + item.subtotal, 0);
    respuestas.success(req, res, { items: carrito.length, total: totalVenta.toFixed(2) }, 200);
}

async function comprar(req, res) {
    try {
        for (const item of carrito) { await db.restarStock(item.id, item.cantidad); }
        carrito = []; 
        respuestas.success(req, res, 'Venta finalizada', 200);
    } catch (err) { respuestas.error(req, res, err.message, 500); }
}

module.exports = { agregarCarrito, listarCarrito, totalesCarrito, comprar };