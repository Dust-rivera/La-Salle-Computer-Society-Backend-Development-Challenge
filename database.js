import mysql from 'mysql2'

import dotenv from 'dotenv'
dotenv.config()

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
}).promise()

export async function getProducts() {
    const [rows] = await pool.query("SELECT * FROM products")
    return rows.map(product => ({
        ...product,
        price: parseFloat(product.price)
    }))
    return rows
}

export async function getProductbyID(id) {
    const [rows] = await pool.query(`
        SELECT * 
        FROM products 
        WHERE id = ?
        `, [id])
    return rows[0]
}

export async function createProduct(name, price, model, stock, type) {
    const [result] = await pool.query(`
    INSERT INTO products (name, price, model, stock, type)
    VALUES (?, ?, ?, ?, ?)
    `, [name, price, model, stock, type])
    const id = result.insertId
}

export async function putProduct(id, updates) {
    const fields = [];
    const values = [];

    for (const [key, value] of Object.entries(updates)) {
        fields.push(`${key} = ?`);
        values.push(value);
    }

    if (fields.length === 0) return 0;

    values.push(id);

    const sql = `UPDATE products SET ${fields.join(', ')} WHERE id = ?`;
    const [result] = await pool.query(sql, values);
    return result.affectedRows;
}

export async function deleteProduct(id) {
    const [result] = await pool.query('DELETE FROM products WHERE id = ?', [id]);
    return result.affectedRows;
}
