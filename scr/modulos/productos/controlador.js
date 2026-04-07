const conexion = require('../../bd/mysql');

// Listar productos
exports.listarProductos = async (req, res) => {
    try {
        const [rows] = await conexion.query(
            'SELECT id, nombre, descripcion, precio, stock, categoria FROM productos'
        );
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err });
    }
};

// Crear producto
exports.crearProducto = async (req, res) => {
    const { nombre, descripcion, precio, stock, categoria } = req.body;
    try {

         const precioDecimal = parseFloat(precio);//*

        const [result] = await conexion.query(
            'INSERT INTO productos (nombre, descripcion, precio, stock, categoria) VALUES (?, ?, ?, ?, ?)',
            [nombre, descripcion, precioDecimal, stock, categoria]
        );
        res.json({ id: result.insertId, nombre, descripcion, precio: precioDecimal, stock, categoria });
    } catch (err) {
        res.status(500).json({ error: err });
    }
};

// Actualizar producto
exports.actualizarProducto = async (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion, precio, stock, categoria } = req.body;
    try {
        await conexion.query(
            'UPDATE productos SET nombre=?, descripcion=?, precio=?, stock=?, categoria=? WHERE id=?',
            [nombre, descripcion, precio, stock, categoria, id]
        );
        res.json({ id, nombre, descripcion, precio, stock, categoria });
    } catch (err) {
        res.status(500).json({ error: err });
    }
};

// Eliminar producto
exports.eliminarProducto = async (req, res) => {
    const { id } = req.params;
    try {
        await conexion.query('DELETE FROM productos WHERE id=?', [id]);
        res.json({ mensaje: 'Producto eliminado' });
    } catch (err) {
        res.status(500).json({ error: err });
    }
};
