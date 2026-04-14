const db = require('../../bd/mysql');
const respuestas = require('../../red/respuestas');

let carrito = []; 

async function agregarCarrito(req, res) {
    try {
        const { idProducto, cantidad, codigoPromo } = req.body; 
        
        // Convertimos a entero para que mysql.js no busque en la columna 'usuario'
        const idLimpio = parseInt(idProducto);
        const producto = await db.uno('productos', idLimpio);
        
        if (!producto) return respuestas.error(req, res, 'Producto no encontrado', 404);

        // --- ASIGNACIÓN CORRECTA DE CAMPOS ---
        const nombreProducto = producto.nombre; // Aquí va el nombre "2222"
        let precioBase = parseFloat(producto.precio); // Aquí va el precio "4444"
        let porcentajeDescuento = 0;

        // BÚSQUEDA DE PROMO
        if (codigoPromo && codigoPromo.trim() !== "") {
            const todasPromos = await db.todos('promociones');
            const promoEncontrada = todasPromos.find(p => 
                p.codigo.toLowerCase() === codigoPromo.trim().toLowerCase()
            );

            if (promoEncontrada) {
                // Se usa la columna 'valor' de tu tabla
                porcentajeDescuento = parseFloat(promoEncontrada.valor || 0);
            }
        }

        // OPERACIÓN MATEMÁTICA: 4444 * (1 - 0.10) = 3999.60
        const precioVenta = precioBase * (1 - (porcentajeDescuento / 100));
        const subtotalCalculado = precioVenta * parseInt(cantidad);

        const nuevoItem = {
            id: idLimpio,
            nombre: nombreProducto,
            precioOriginal: precioBase,
            precioVenta: precioVenta, 
            descuento: porcentajeDescuento,
            cantidad: parseInt(cantidad),
            subtotal: subtotalCalculado 
        };
        
        carrito.push(nuevoItem);
        return respuestas.success(req, res, nuevoItem, 201);

    } catch (err) {
        console.error("Error en agregarCarrito:", err);
        return respuestas.error(req, res, 'Error interno', 500);
    }
}

function listarCarrito(req, res) {
    respuestas.success(req, res, carrito, 200);
}

function totalesCarrito(req, res) {
    const totalVenta = carrito.reduce((acc, item) => acc + item.subtotal, 0);
    respuestas.success(req, res, { 
        items: carrito.length, 
        total: totalVenta.toFixed(2) 
    }, 200);
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

module.exports = { 
    agregarCarrito, 
    listarCarrito, 
    totalesCarrito, 
    comprar 
};