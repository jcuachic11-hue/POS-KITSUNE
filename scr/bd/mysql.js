const mysql = require('mysql2/promise');

const dbConfig = {
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  port: process.env.MYSQLPORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

const pool = mysql.createPool(dbConfig);

// Estas funciones ahora sí existen y el controlador las puede llamar
async function todos(tabla) {
    const [rows] = await pool.query(`SELECT * FROM ??`, [tabla]);
    return rows;
}

async function uno(tabla, id) {
    const [rows] = await pool.query(`SELECT * FROM ?? WHERE id = ?`, [tabla, id]);
    return rows[0];
}

/*async function agregar(tabla, data) {
    if (data && data.id) {
        // UPDATE: Si el objeto trae ID
        return await pool.query(`UPDATE ?? SET ? WHERE id = ?`, [tabla, data, data.id]);
    } else {
        // INSERT: Si es un producto nuevo
        return await pool.query(`INSERT INTO ?? SET ?`, [tabla, data]);
    }
}
*/

async function agregar(tabla, data) {
    if (data && data.id) {
        // Separamos el ID del resto de los datos para no actualizar la llave primaria
        const { id, ...datosAActualizar } = data; 
        
        // UPDATE: Usamos solo los campos restantes (como stock)
        return await pool.query(`UPDATE ?? SET ? WHERE id = ?`, [tabla, datosAActualizar, id]);
    } else {
        // INSERT: Si es un producto nuevo
        return await pool.query(`INSERT INTO ?? SET ?`, [tabla, data]);
    }
}

async function restarStock(id, cantidad) {
    return await pool.query(
        `UPDATE productos SET stock = stock - ? WHERE id = ?`, 
        [cantidad, id]
    );
}

module.exports = {
    todos,
    uno,
    agregar,
    eliminar,
    restarStock // <--- No olvides exportarla
};
async function eliminar(tabla, id) {
    return await pool.query(`DELETE FROM ?? WHERE id = ?`, [tabla, id]);
}

module.exports = {
    todos,
    uno,
    agregar,
    eliminar,
    restarStock
};