const db = require('../../bd/mysql');
const respuestas = require('../../red/respuestas');

let carrito = []; 

async function agregarCarrito(req, res) {
    try {
        const { idProducto, cantidad, codigoPromo } = req.body; 
        
        const producto = await db.uno('productos', idProducto);
        if (!producto) return respuestas.error(req, res, 'Producto no encontrado', 404);

        let precioBase = parseFloat(producto.precio);
        let porcentajeDescuento = 0;

        // BÚSQUEDA DE LA PROMO
        if (codigoPromo && codigoPromo.trim() !== "") {
            try {
                // Buscamos en la columna 'codigo'
                const promos = await db.query('SELECT * FROM promociones WHERE codigo = ?', [codigoPromo.trim()]);
                if (promos && promos.length > 0) {
                    porcentajeDescuento = parseFloat(promos[0].valor);
                }
            } catch (err) {
                console.log("Error en consulta de promo:", err.message);
            }
        }

        // --- OPERACIÓN DE LA RESTA ---
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

// Esta función debe llamarse exactamente como la pide tu archivo de rutas
async function todos(req, res) {
    respuestas.success(req, res, carrito, 200);
}

// Función para limpiar el carrito (opcional, pero recomendada)
async function eliminar(req, res) {
    carrito = [];
    respuestas.success(req, res, 'Carrito vaciado', 200);
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

// REVISA AQUÍ: He puesto los nombres más comunes que suelen tener las rutas
module.exports = {
    agregar: agregarCarrito, // Si tu ruta dice .post('/', controlador.agregar)
    agregarCarrito,          // Por si acaso
    todos,                   // Esta es la que probablemente busca el .get('/')
    listarCarrito: todos,    // Alias por si acaso
    eliminar, 
    comprar
};