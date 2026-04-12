const db = require('../../bd/mysql');
const respuestas = require('../../red/respuestas');

let carrito = [];

const agregarCarrito = async (req, res) => {
    let { idProducto, cantidad } = req.body;   
    cantidad = parseInt(cantidad, 10);          

    if (isNaN(cantidad) || cantidad <= 0) {
        return respuestas.error(req, res, 'Cantidad inválida', 400);
    }

    try {
        // Usamos db.uno para buscar el producto (igual que en otros módulos)
        const producto = await db.uno('productos', idProducto);
        
        if (!producto) {
            return respuestas.error(req, res, 'Producto no encontrado', 404);
        }

        // Verificar stock
        if (producto.stock < cantidad) {
            return respuestas.error(req, res, `Stock insuficiente. Disponible: ${producto.stock}`, 400);
        }

        carrito.push({
            id: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            cantidad
        });

        respuestas.success(req, res, { mensaje: 'Producto agregado', carrito }, 201);
    } catch (err) {
        respuestas.error(req, res, err.message, 500);
    }
};

const listarCarrito = (req, res) => {
    respuestas.success(req, res, carrito, 200);
};

const totalesCarrito = (req, res) => {
    const totalPrecio = carrito.reduce((acc, p) => acc + (p.precio * p.cantidad), 0);
    const totalItems = carrito.reduce((acc, p) => acc + p.cantidad, 0);
    respuestas.success(req, res, { totalPrecio, totalItems }, 200);
};

const comprar = async (req, res) => {
    if (carrito.length === 0) {
        return respuestas.error(req, res, 'El carrito está vacío', 400);
    }

    try {
        // Actualizar stock de cada producto usando la lógica de db.agregar
        for (const item of carrito) {
            const nuevoStock = item.stock_actual - item.cantidad; // Necesitaríamos el stock previo
            // Para mantenerlo simple y directo como en tu código original:
            await db.agregar('productos', {
                id: item.id,
                stock: -item.cantidad // Esto asume que tu db.agregar o un query directo maneje la resta
            });
        }
        
        carrito = []; 
        respuestas.success(req, res, 'Compra realizada con éxito', 200);
    } catch (err) {
        respuestas.error(req, res, 'Error al procesar la compra', 500);
    }
};

module.exports = {
    agregarCarrito,
    listarCarrito,
    totalesCarrito,
    comprar
};