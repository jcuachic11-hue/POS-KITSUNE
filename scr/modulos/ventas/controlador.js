const db = require('../../bd/mysql');
const respuestas = require('../../red/respuestas');

let carrito = []; 

async function agregarCarrito(req, res) {
    try {
        const { idProducto, cantidad, codigoPromo } = req.body; 
        
        // Convertimos a Int para que db.uno no busque en la columna 'usuario'
        const idLimpio = parseInt(idProducto);
        const producto = await db.uno('productos', idLimpio);
        
        if (!producto) return respuestas.error(req, res, 'Producto no encontrado', 404);

        let precioBase = parseFloat(producto.precio);
        let porcentajeDescuento = 0;

        // BÚSQUEDA DE PROMO
        if (codigoPromo && codigoPromo.trim() !== "") {
            const todasPromos = await db.todos('promociones');
            const promoEncontrada = todasPromos.find(p => 
                p.codigo.toLowerCase() === codigoPromo.trim().toLowerCase()
            );

            if (promoEncontrada) {
                // Usamos la columna 'valor' de tu tabla promociones
                porcentajeDescuento = parseFloat(promoEncontrada.valor || 0);
            }
        }

        // LA RESTA: Se aplica directamente al precio base
        const precioVenta = precioBase * (1 - (porcentajeDescuento / 100));
        const subtotalCalculado = precioVenta * parseInt(cantidad);

        const nuevoItem = {
            id: idLimpio,
            nombre: producto.nombre,
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
        respuestas.success(req, res, 'Venta realizada con éxito', 200);
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