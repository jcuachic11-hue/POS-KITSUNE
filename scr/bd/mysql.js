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

// --- FUNCIONES GENERALES ---

async function todos(tabla) {
    const [rows] = await pool.query(`SELECT * FROM ??`, [tabla]);
    return rows;
}

async function uno(tabla, id) {
    const [rows] = await pool.query(`SELECT * FROM ?? WHERE id = ?`, [tabla, id]);
    return rows[0];
}

async function agregar(tabla, data) {
    if (data && data.id) {
        // UPDATE
        const { id, ...datosAActualizar } = data; 
        return await pool.query(`UPDATE ?? SET ? WHERE id = ?`, [tabla, datosAActualizar, id]);
    } else {
        // INSERT
        return await pool.query(`INSERT INTO ?? SET ?`, [tabla, data]);
    }
}

async function eliminar(tabla, id) {
    return await pool.query(`DELETE FROM ?? WHERE id = ?`, [tabla, id]);
}

// --- FUNCIONES DE STOCK (VENTAS Y DEVOLUCIONES) ---

async function restarStock(id, cantidad) {
    return await pool.query(
        `UPDATE productos SET stock = stock - ? WHERE id = ?`, 
        [cantidad, id]
    );
}

async function sumarStock(id, cantidad) {
    return await pool.query(
        `UPDATE productos SET stock = stock + ? WHERE id = ?`, 
        [cantidad, id]
    );
}

// --- EXPORTACIÓN ÚNICA (AL FINAL) ---

module.exports = {
    todos,
    uno,
    agregar,
    eliminar,
    restarStock,
    sumarStock
};