const db = require('../../bd/mysql');
const respuestas = require('../../red/respuestas');

let carrito = []; 

exports.agregarCarrito = async (req, res) => {
    // ... (tu código de agregar actual)
};

exports.listarCarrito = (req, res) => {
    respuestas.success(req, res, carrito, 200);
};

exports.comprar = async (req, res) => {
    try {
        if (carrito.length === 0) {
            return respuestas.error(req, res, 'El carrito está vacío', 400);
        }

        // RECORREMOS EL CARRITO PARA RESTAR STOCK
        for (const item of carrito) {
            // 1. Buscamos el producto actual en la DB
            const productoDB = await db.uno('productos', item.id);
            
            if (productoDB) {
                // 2. Calculamos el nuevo stock
                const nuevoStock = productoDB.stock - item.cantidad;
                
                // 3. Actualizamos en la base de datos
                // Usamos db.agregar porque tu sistema ya detecta si es UPDATE por el ID
                await db.agregar('productos', {
                    id: item.id,
                    stock: nuevoStock
                });
            }
        }

        // 4. Vaciamos el carrito después de afectar la DB
        carrito = []; 
        respuestas.success(req, res, 'Venta procesada y stock actualizado', 200);

    } catch (err) {
        respuestas.error(req, res, 'Error al procesar la venta: ' + err.message, 500);
    }
};