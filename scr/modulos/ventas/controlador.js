const db = require('../../bd/mysql');
const respuestas = require('../../red/respuestas');

let carrito = []; 

// Función principal para agregar productos con resta de promo
async function agregarCarrito(req, res) {
    try {
        const { idProducto, cantidad, codigoPromo } = req.body; 
        
        const producto = await db.uno('productos', idProducto);
        if (!producto) return respuestas.error(req, res, 'Producto no encontrado', 404);

        let precioBase = parseFloat(producto.precio);
        let porcentajeDescuento = 0;

        // Búsqueda de promoción por columna 'codigo'
        if (codigoPromo && codigoPromo.trim() !== "") {
            try {
                const promos = await db.query('SELECT * FROM promociones WHERE codigo = ?', [codigoPromo.trim()]);
                if (promos && promos.length > 0) {
                    porcentajeDescuento = parseFloat(promos[0].valor);
                }
            } catch (err) {
                console.log("Aviso: Falló consulta de promo.");
            }
        }

        // OPERACIÓN DE LA RESTA
        const precioConDescuento = precioBase * (1 - (porcentajeDescuento / 100));
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
        return respuestas.success(req, res, nuevoItem, 201);
    } catch (err) {
        return respuestas.error(req, res, 'Error interno', 500);
    }
}

// Función para listar (Get) - Coincide con línea 7 u 8 de tus rutas
async function listarTodos(req, res) {
    respuestas.success(req, res, carrito, 200);
}

// Función para comprar
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

// Función para vaciar carrito (Eliminar)
async function eliminarCarrito(req, res) {
    carrito = [];
    respuestas.success(req, res, 'Carrito limpio', 200);
}

// Mapeo total de exportaciones para evitar cualquier Undefined en rutas.js
module.exports = {
    todos: listarTodos,
    uno: listarTodos, // Por si acaso buscas por ID
    agregar: agregarCarrito,
    agregarCarrito,
    comprar,
    eliminar: eliminarCarrito,
    listar: listarTodos
};