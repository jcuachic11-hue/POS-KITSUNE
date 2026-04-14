const db = require('../../bd/mysql');
const respuestas = require('../../red/respuestas');

let carrito = []; 

async function agregarCarrito(req, res) {
    try {
        const { idProducto, cantidad, codigoPromo } = req.body; 
        console.log(`Intentando agregar: Prod ${idProducto}, Cant ${cantidad}, Promo [${codigoPromo}]`);

        const producto = await db.uno('productos', idProducto);
        if (!producto) return respuestas.error(req, res, 'Producto no encontrado', 404);

        let precioOriginal = parseFloat(producto.precio);
        let porcentajeDescuento = 0;

        if (codigoPromo && codigoPromo.trim() !== "") {
            try {
                // Forzamos la búsqueda. Asegúrate que la columna se llame 'codigo'
                const resultados = await db.query('SELECT * FROM promociones WHERE codigo = ?', [codigoPromo.trim()]);
                
                if (resultados && resultados.length > 0) {
                    porcentajeDescuento = parseFloat(resultados[0].valor);
                    console.log(`¡PROMO ENCONTRADA! Valor: ${porcentajeDescuento}%`);
                } else {
                    console.log(`La promo [${codigoPromo}] NO existe en la columna 'codigo'`);
                }
            } catch (err) {
                console.log("Error en la consulta SQL de promo:", err.message);
            }
        }

        // CÁLCULO MANUAL (Aquí se hace la resta)
        const factorDescuento = porcentajeDescuento / 100; // Ej: 0.10
        const precioVenta = precioOriginal * (1 - factorDescuento); // Ej: 4444 * 0.90

        const nuevoItem = {
            id: idProducto,
            nombre: producto.nombre,
            precioOriginal: precioOriginal,
            precioVenta: precioVenta, 
            descuento: porcentajeDescuento,
            cantidad: parseInt(cantidad),
            subtotal: precioVenta * parseInt(cantidad)
        };
        
        carrito.push(nuevoItem);
        respuestas.success(req, res, nuevoItem, 201);

    } catch (err) {
        console.error("Error fatal:", err);
        respuestas.error(req, res, 'Error en el servidor', 500);
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
        respuestas.success(req, res, 'Venta finalizada', 200);
    } catch (err) {
        respuestas.error(req, res, err.message, 500);
    }
}

module.exports = { agregarCarrito, listarCarrito, totalesCarrito, comprar };