const db = require('../../bd/mysql');
const respuestas = require('../../red/respuestas');

let carrito = []; 

async function agregarCarrito(req, res) {
    try {
        const { idProducto, cantidad, codigoPromo } = req.body; 
        
        // 1. Buscamos el producto
        const producto = await db.uno('productos', idProducto);
        if (!producto) {
            return respuestas.error(req, res, 'Producto no encontrado', 404);
        }

        let precioFinal = producto.precio;
        let porcentajeDescuento = 0;

        // 2. Lógica de Promoción (Si el usuario escribió algo)
        if (codigoPromo && codigoPromo.trim() !== "") {
            // Buscamos en la tabla promociones por el ID/Código
            const promo = await db.uno('promociones', codigoPromo);
            
            if (promo) {
                porcentajeDescuento = promo.valor; // Ejemplo: 10
                const descuento = (producto.precio * porcentajeDescuento) / 100;
                precioFinal = producto.precio - descuento;
            }
        }

        const nuevoItem = {
            id: idProducto,
            nombre: producto.nombre,
            precioOriginal: producto.precio,
            precioVenta: precioFinal,
            descuento: porcentajeDescuento,
            cantidad: parseInt(cantidad),
            subtotal: precioFinal * parseInt(cantidad)
        };
        
        carrito.push(nuevoItem);
        respuestas.success(req, res, nuevoItem, 201);

    } catch (err) {
        console.error(err);
        respuestas.error(req, res, 'Error al procesar producto', 500);
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