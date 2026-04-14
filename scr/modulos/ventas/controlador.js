const db = require('../../bd/mysql');
const respuestas = require('../../red/respuestas');

let carrito = []; 

async function agregarCarrito(req, res) {
    try {
        const { idProducto, cantidad, codigoPromo } = req.body; 
        
        // 1. Buscamos el producto (Si esto falla, el ID no existe)
        const producto = await db.uno('productos', idProducto);
        if (!producto) {
            return respuestas.error(req, res, 'Producto no encontrado', 404);
        }

        let precioBase = parseFloat(producto.precio);
        let porcentajeDescuento = 0;

        // 2. Intento de buscar promoción (Si falla, sigue adelante con 0%)
        if (codigoPromo && codigoPromo.trim() !== "") {
            try {
                // Cambié la consulta para ser más genérica. 
                // Asegúrate que en la DB el código sea '01'
                const promos = await db.query('SELECT * FROM promociones WHERE codigo = ?', [codigoPromo.trim()]);
                if (promos && promos.length > 0) {
                    porcentajeDescuento = parseFloat(promos[0].valor);
                }
            } catch (err) {
                console.log("Aviso: No se pudo consultar la tabla promociones.");
            }
        }

        // 3. OPERACIÓN MATEMÁTICA DE LA RESTA
        // PrecioVenta = Precio - (Precio * 0.10)
        const precioConDescuento = precioBase - (precioBase * (porcentajeDescuento / 100));
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
        // Enviamos respuesta exitosa para que el botón de cargar "despierte"
        return respuestas.success(req, res, nuevoItem, 201);

    } catch (err) {
        console.error("Error Crítico:", err);
        // Enviamos respuesta de error para que el fetch no se quede colgado
        return respuestas.error(req, res, 'Error en el servidor', 500);
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