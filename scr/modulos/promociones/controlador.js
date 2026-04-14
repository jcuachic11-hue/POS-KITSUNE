const db = require('../../bd/mysql');
const respuestas = require('../../red/respuestas');

const TABLA = 'promociones';

exports.listarPromociones = async (req, res) => {
    try {
        const items = await db.todos(TABLA);
        respuestas.success(req, res, items, 200);
    } catch (err) {
        respuestas.error(req, res, err.message, 500);
    }
};

exports.obtenerPromocion = async (req, res) => {
    try {
        // Buscamos por código (ej: PROMO10)
        const item = await db.uno(TABLA, req.params.codigo);
        if (item) {
            respuestas.success(req, res, item, 200);
        } else {
            respuestas.error(req, res, 'Promoción no válida', 404);
        }
    } catch (err) {
        respuestas.error(req, res, err.message, 500);
    }
};

exports.crearPromocion = async (req, res) => {
    try {
        // El id es AUTO_INCREMENT
        await db.agregar(TABLA, req.body);
        respuestas.success(req, res, 'Promoción creada', 201);
    } catch (err) {
        respuestas.error(req, res, err.message, 500);
    }
};

exports.eliminarPromocion = async (req, res) => {
    try {
        await db.eliminar(TABLA, req.params.id);
        respuestas.success(req, res, 'Promoción eliminada', 200);
    } catch (err) {
        respuestas.error(req, res, err.message, 500);
    }
};

exports.actualizarPromocion = async (req, res) => {
    try {
       
        await db.agregar(TABLA, req.body); 
        respuestas.success(req, res, 'Promoción actualizada', 200);
    } catch (err) {
        respuestas.error(req, res, err.message, 500);
    }
};
