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

        let precioOriginal = producto.precio;
        let porcentajeDescuento = 0;
        let precioConDescuento = precioOriginal;

        // --- LÓGICA DE DESCUENTO ---
        if (codigoPromo && codigoPromo.trim() !== "") {
            const promo = await db.uno('promociones', codigoPromo);
            
            if (promo && promo.valor) {
                porcentajeDescuento = parseFloat(promo.valor); // Ejemplo: 15
                // Operación matemática: Precio - (Precio * 0.15)
                const montoDescuento = precioOriginal * (porcentajeDescuento / 100);
                precioConDescuento = precioOriginal - montoDescuento;
                
                console.log(`Promo aplicada: ${codigoPromo} (-${porcentajeDescuento}%)`);
            }
        }

        const nuevoItem = {
            id: idProducto,
            nombre: producto.nombre,
            precioOriginal: precioOriginal,
            precioVenta: precioConDescuento, // Este es el que se cobra
            descuento: porcentajeDescuento,
            cantidad: parseInt(cantidad),
            subtotal: precioConDescuento * parseInt(cantidad)
        };
        
        carrito.push(nuevoItem);
        respuestas.success(req, res, nuevoItem, 201);

    } catch (err) {
        console.error("Error en agregarCarrito:", err);
        respuestas.error(req, res, 'Error interno', 500);
    }
}

function listarCarrito(req, res) {
    respuestas.success(req, res, carrito, 200);
}

function totalesCarrito(req, res) {
    const total = carrito.reduce((acc, item) => acc + item.subtotal, 0);
    respuestas.success(req, res, { 
        items: carrito.length,
        total: total.toFixed(2)
    }, 200);
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

module.exports = {
    agregarCarrito,
    listarCarrito,
    totalesCarrito,
    comprar
};