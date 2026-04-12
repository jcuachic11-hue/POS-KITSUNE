const db = require('../../bd/mysql');
const respuestas = require('../../red/respuestas');

let carrito = []; // Carrito temporal en memoria

exports.agregarCarrito = async (req, res) => {
    try {
        const { idProducto, cantidad } = req.body;
        const producto = await db.uno('productos', idProducto);
        
        if (!producto) return respuestas.error(req, res, 'No existe el producto', 404);
        
        carrito.push({
            id: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            cantidad: parseInt(cantidad)
        });
        respuestas.success(req, res, 'Agregado al carrito', 201);
    } catch (err) {
        respuestas.error(req, res, err.message, 500);
    }
};

exports.listarCarrito = (req, res) => {
    respuestas.success(req, res, carrito, 200);
};

exports.totalesCarrito = (req, res) => {
    const total = carrito.reduce((acc, p) => acc + (p.precio * p.cantidad), 0);
    respuestas.success(req, res, { total }, 200);
};

exports.comprar = async (req, res) => {
    try {
        if (carrito.length === 0) return respuestas.error(req, res, 'Carrito vacío', 400);
        // Aquí iría la lógica de restar stock que vimos antes
        carrito = []; 
        respuestas.success(req, res, 'Venta completada', 200);
    } catch (err) {
        respuestas.error(req, res, err.message, 500);
    }
};