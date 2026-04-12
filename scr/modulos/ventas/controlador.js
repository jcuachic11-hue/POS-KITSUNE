const db = require('../../bd/mysql');
const respuestas = require('../../red/respuestas');

let carrito = []; 

// --- AGREGAR (Mantenlo igual) ---
function agregarCarrito(req, res) {
    const item = req.body; // { id: "2", precio: 10, cantidad: 100 }
    carrito.push(item);
    respuestas.success(req, res, 'Producto añadido al carrito', 201);
}

// --- LISTAR Y TOTALES (Mantenlos igual) ---
function listarCarrito(req, res) {
    respuestas.success(req, res, carrito, 200);
}

function totalesCarrito(req, res) {
    const total = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
    respuestas.success(req, res, { total }, 200);
}

// --- COMPRAR (Aquí es donde se hace la resta real) ---
async function comprar(req, res) {
    try {
        if (carrito.length === 0) {
            return respuestas.error(req, res, 'El carrito está vacío', 400);
        }

        // Usamos un for...of para poder usar await dentro
        for (const item of carrito) {
            // 1. Buscamos el producto en la tabla 'productos' por su ID
            const productoDB = await db.uno('productos', item.id);
            
            if (productoDB) {
                // 2. Calculamos la resta
                const stockActual = parseInt(productoDB.stock);
                const cantidadVendida = parseInt(item.cantidad);
                const nuevoStock = stockActual - cantidadVendida;

                // 3. Mandamos la actualización a la base de datos
                // Importante: Mandamos el ID y el nuevo stock
                await db.agregar('productos', { 
                    id: item.id, 
                    stock: nuevoStock 
                });
            }
        }

        // 4. Vaciamos el carrito después de actualizar la DB
        carrito = []; 
        respuestas.success(req, res, 'Venta procesada y stock actualizado en MySQL', 200);

    } catch (err) {
        console.error("Error en la resta de stock:", err);
        respuestas.error(req, res, 'Error al actualizar stock: ' + err.message, 500);
    }
}

module.exports = {
    agregarCarrito,
    listarCarrito,
    totalesCarrito,
    comprar
};