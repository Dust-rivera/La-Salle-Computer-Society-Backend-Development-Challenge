import { createPool } from 'mysql2'
import dotenv from 'dotenv'

dotenv.config()

// Create a MySQL connection pool using environment variables
export const pool = createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
}).promise()

// Get all products from the database
export async function getProducts() {
    const [rows] = await pool.query("SELECT * FROM products")
    return rows.map(product => ({
        ...product,
        price: parseFloat(product.price)
    }))
    return rows
}

// Get a single product by its ID
export async function getProductbyID(id) {
    const [rows] = await pool.query(`
        SELECT * 
        FROM products 
        WHERE id = ?
        `, [id])
    return rows[0]
}

// Create a new product and return its details
export async function createProduct(name, price, model, stock, type) {
  const [result] = await pool.query(
    `INSERT INTO products (name, price, model, stock, type)
     VALUES (?, ?, ?, ?, ?)`,
    [name, price, model, stock, type]
  );
  return { id: result.insertId, name, price, model, stock, type }; 
}

// Update an existing product by ID with provided fields
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

// Delete a product by ID
export async function deleteProduct(id) {
  const [result] = await pool.query('DELETE FROM products WHERE id = ?', [id]);
  return result.affectedRows;
}
