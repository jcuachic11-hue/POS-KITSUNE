const conexion = require('../../bd/mysql'); // Ajustado a tu archivo de conexión
const respuestas = require('../../red/respuestas');

// ⚠️ Nota: Para un POS real, el carrito debería manejarse en el Frontend (localStorage)
// o en una tabla de la DB. Por ahora lo dejamos aquí, pero corregimos las respuestas.
let carrito = [];

const agregarCarrito = async (req, res) => {
    let { idProducto, cantidad } = req.body;   
    cantidad = parseInt(cantidad, 10);          

    if (isNaN(cantidad) || cantidad <= 0) {
        return respuestas.error(req, res, 'Cantidad inválida', 400);
    }

    try {
        const [rows] = await conexion.query('SELECT * FROM productos WHERE id = ?', [idProducto]);
        
        if (rows.length === 0) {
            return respuestas.error(req, res, 'Producto no encontrado', 404);
        }

        const producto = rows[0];

        // Verificar si hay stock suficiente antes de agregar
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
        // Actualizar stock de cada producto
        for (const item of carrito) {
            await conexion.query(
                'UPDATE productos SET stock = stock - ? WHERE id = ?',
                [item.cantidad, item.id]
            );
        }
        
        // Limpiar carrito tras la compra
        carrito = []; 
        respuestas.success(req, res, 'Compra realizada con éxito', 200);
    } catch (err) {
        respuestas.error(req, res, 'Error al procesar la compra en la base de datos', 500);
    }
};

module.exports = {
    agregarCarrito,
    listarCarrito,
    totalesCarrito,
    comprar
};