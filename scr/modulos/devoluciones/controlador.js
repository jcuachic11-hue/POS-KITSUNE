const conexion = require('../../bd/mysql');

async function devolverProducto(req, res) {
  const { productoId, cantidad } = req.body;
  try {
    if (!productoId || !cantidad) {
      return res.status(400).json({ error: 'Faltan datos: productoId o cantidad' });
    }

    // Actualizar stock directamente en productos
    await conexion.query('UPDATE productos SET stock = stock + ? WHERE id = ?', [cantidad, productoId]);

    // En lugar de insertar en una tabla devoluciones, solo devolvemos confirmación
    return res.json({
      ok: true,
      productoId,
      cantidad,
      mensaje: 'Devolución registrada (sin historial en BD)'
    });
  } catch (err) {
    console.error('Error devolverProducto:', err);
    return res.status(500).json({ ok: false, error: err.message });
  }
}

async function listarDevoluciones(req, res) {
  // Como no hay tabla devoluciones, devolvemos un arreglo vacío o un mensaje
  return res.json({ ok: true, devoluciones: [], mensaje: 'Historial no disponible en este módulo' });
}

module.exports = { devolverProducto, listarDevoluciones };