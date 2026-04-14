const db = require('../../bd/mysql');
const respuestas = require('../../red/respuestas');

let carrito = []; 

async function agregarCarrito(req, res) {
    try {
        const { idProducto, cantidad, codigoPromo } = req.body; 
        const producto = await db.uno('productos', idProducto);
        
        if (!producto) return respuestas.error(req, res, 'Producto no encontrado', 404);

        let precioOriginal = parseFloat(producto.precio);
        let porcentajeDescuento = 0;

        // Búsqueda de la promo
        if (codigoPromo && codigoPromo.trim() !== "") {
            const resultados = await db.query('SELECT * FROM promociones WHERE codigo = ?', [codigoPromo.trim()]);
            if (resultados && resultados.length > 0) {
                porcentajeDescuento = parseFloat(resultados[0].valor);
            }
        }

        // --- LINEAS DE LA RESTA ---
        const descuento = precioOriginal * (porcentajeDescuento / 100);
        const precioConDescuento = precioOriginal - descuento;
        const subtotalFila = precioConDescuento * parseInt(cantidad);

        const nuevoItem = {
            id: idProducto,
            nombre: producto.nombre,
            precioOriginal: precioOriginal,
            precioVenta: precioConDescuento, // El precio ya restado
            descuento: porcentajeDescuento,
            cantidad: parseInt(cantidad),
            subtotal: subtotalFila // El subtotal calculado con el descuento
        };
        
        carrito.push(nuevoItem);
        respuestas.success(req, res, nuevoItem, 201);
    } catch (err) {
        respuestas.error(req, res, 'Error interno', 500);
    }
}

function listarCarrito(req, res) { respuestas.success(req, res, carrito, 200); }
function totalesCarrito(req, res) {
    const total = carrito.reduce((acc, item) => acc + item.subtotal, 0);
    respuestas.success(req, res, { items: carrito.length, total: total.toFixed(2) }, 200);
}
async function comprar(req, res) {
    try {
        if (carrito.length === 0) return respuestas.error(req, res, 'Carrito vacío', 400);
        for (const item of carrito) { await db.restarStock(item.id, item.cantidad); }
        carrito = []; 
        respuestas.success(req, res, 'Venta finalizada', 200);
    } catch (err) { respuestas.error(req, res, err.message, 500); }
}

module.exports = { agregarCarrito, listarCarrito, totalesCarrito, comprar };