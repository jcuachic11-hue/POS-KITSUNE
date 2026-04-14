const db = require('../../bd/mysql');
const respuestas = require('../../red/respuestas');

let carrito = []; 

async function agregarCarrito(req, res) {
    try {
        const { idProducto, cantidad, codigoPromo } = req.body; 
        
        // 1. Buscamos el producto por su ID
        const producto = await db.uno('productos', idProducto);
        if (!producto) {
            return respuestas.error(req, res, 'Producto no encontrado', 404);
        }

        let precioOriginal = parseFloat(producto.precio);
        let porcentajeDescuento = 0;

        // 2. BUSQUEDA POR CÓDIGO (Consulta Directa)
        if (codigoPromo && codigoPromo.trim() !== "") {
            // Buscamos en la tabla promociones donde la columna 'codigo' coincida
            // Si tu columna se llama diferente (ej: 'nombre'), cámbialo aquí abajo:
            const queryPromo = 'SELECT * FROM promociones WHERE codigo = ?';
            const resultados = await db.query(queryPromo, [codigoPromo.trim()]);
            
            if (resultados.length > 0) {
                const promo = resultados[0];
                porcentajeDescuento = parseFloat(promo.valor);
                console.log(`✅ Aplicando promo: ${codigoPromo} (-${porcentajeDescuento}%)`);
            } else {
                console.log(`❌ El código "${codigoPromo}" no existe en la base de datos.`);
            }
        }

        // 3. Cálculo matemático de la resta
        const montoDescuento = precioOriginal * (porcentajeDescuento / 100);
        const precioConDescuento = precioOriginal - montoDescuento;

        const nuevoItem = {
            id: idProducto,
            nombre: producto.nombre,
            precioOriginal: precioOriginal,
            precioVenta: precioConDescuento, 
            descuento: porcentajeDescuento,
            cantidad: parseInt(cantidad),
            subtotal: precioConDescuento * parseInt(cantidad)
        };
        
        carrito.push(nuevoItem);
        respuestas.success(req, res, nuevoItem, 201);

    } catch (err) {
        console.error("Error en ventas:", err);
        respuestas.error(req, res, 'Error al procesar la venta', 500);
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
        if (carrito.length === 0) return respuestas.error(req, res, 'El carrito está vacío', 400);

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