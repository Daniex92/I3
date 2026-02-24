import { pool } from '../config/externalServices.js';

export class Product {
  static async findAll(filters = {}) {
    let query = `
      SELECT p.*, c.name as category_name, sc.name as subcategory_name
      FROM products p
      JOIN subcategories sc ON p.subcategory_id = sc.id
      JOIN categories c ON sc.category_id = c.id
      WHERE 1=1
    `;
    const params = [];

    if (filters.category_id) {
      query += ` AND c.id = ?`;
      params.push(filters.category_id);
    }

    if (filters.subcategory_id) {
      query += ` AND sc.id = ?`;
      params.push(filters.subcategory_id);
    }

    if (filters.minPrice) {
      query += ` AND p.price >= ?`;
      params.push(filters.minPrice);
    }

    if (filters.maxPrice) {
      query += ` AND p.price <= ?`;
      params.push(filters.maxPrice);
    }

    if (filters.search) {
      query += ` AND (p.name LIKE ? OR p.description LIKE ?)`;
      const searchTerm = `%${filters.search}%`;
      params.push(searchTerm, searchTerm);
    }

    const sortMap = {
      'price-asc': 'p.price ASC',
      'price-desc': 'p.price DESC',
      'newest': 'p.created_at DESC',
    };
    const sortClause = sortMap[filters.sort] || 'p.created_at DESC';
    query += ` ORDER BY ${sortClause}`;

    const [rows] = await pool.query(query, params);
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.query(`
      SELECT p.*, c.name as category_name, sc.name as subcategory_name
      FROM products p
      JOIN subcategories sc ON p.subcategory_id = sc.id
      JOIN categories c ON sc.category_id = c.id
      WHERE p.id = ?
    `, [id]);
    return rows[0];
  }

  static async create(subcategoryId, name, description, price, stock, imageUrl) {
    const [result] = await pool.query(
      'INSERT INTO products (subcategory_id, name, description, price, stock, image_url) VALUES (?, ?, ?, ?, ?, ?)',
      [subcategoryId, name, description, price, stock, imageUrl]
    );
    return result;
  }

  static async update(id, data) {
    const fields = [];
    const values = [];

    Object.entries(data).forEach(([key, value]) => {
      fields.push(`${key} = ?`);
      values.push(value);
    });

    values.push(id);

    const query = `UPDATE products SET ${fields.join(', ')} WHERE id = ?`;
    const [result] = await pool.query(query, values);
    return result;
  }

  static async delete(id) {
    const [result] = await pool.query('DELETE FROM products WHERE id = ?', [id]);
    return result;
  }
}
