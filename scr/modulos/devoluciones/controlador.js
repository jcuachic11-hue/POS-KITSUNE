const db = require('../../bd/mysql');
const respuestas = require('../../red/respuestas');

async function devolverProducto(req, res) {
    const { productoId, cantidad } = req.body;

    try {
        if (!productoId || !cantidad) {
            return respuestas.error(req, res, 'Faltan datos: productoId o cantidad', 400);
        }

        await db.sumarStock(productoId, cantidad);

        return respuestas.success(req, res, {
            productoId,
            cantidad,
            mensaje: 'Stock reintegrado correctamente'
        }, 200);

    } catch (err) {
        console.error('Error en proceso de devolución:', err);
        return respuestas.error(req, res, 'Error interno: ' + err.message, 500);
    }
}

async function listarDevoluciones(req, res) {
    return respuestas.success(req, res, [], 200);
}

module.exports = { 
    devolverProducto, 
    listarDevoluciones 
};