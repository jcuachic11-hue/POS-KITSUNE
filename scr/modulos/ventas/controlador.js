const db = require('../../bd/mysql');
const respuestas = require('../../red/respuestas');

let carrito = []; 

async function agregarCarrito(req, res) {
    try {
        const { idProducto, cantidad, codigoPromo } = req.body; 
        
        const producto = await db.uno('productos', idProducto);
        if (!producto) {
            return respuestas.error(req, res, 'Producto no encontrado', 404);
        }

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
                console.log("Error en DB promociones");
            }
        }

        // LA RESTA MATEMÁTICA
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

        // IMPORTANTE: Esto es lo que hace que el botón no se quede "colgado"
        return respuestas.success(req, res, nuevoItem, 201);

    } catch (err) {
        console.error(err);
        return respuestas.error(req, res, 'Error interno', 500);
    }
}

function listarCarrito(req, res) {
    return respuestas.success(req, res, carrito, 200);
}

function totalesCarrito(req, res) {
    const total = carrito.reduce((acc, item) => acc + item.subtotal, 0);
    return respuestas.success(req, res, { items: carrito.length, total: total.toFixed(2) }, 200);
}

async function comprar(req, res) {
    try {
        if (carrito.length === 0) return respuestas.error(req, res, 'Vacío', 400);
        for (const item of carrito) {
            await db.restarStock(item.id, item.cantidad);
        }
        carrito = []; 
        return respuestas.success(req, res, 'Venta OK', 200);
    } catch (err) {
        return respuestas.error(req, res, err.message, 500);
    }
}

module.exports = { agregarCarrito, listarCarrito, totalesCarrito, comprar };