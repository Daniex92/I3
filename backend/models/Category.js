import { pool } from '../config/externalServices.js';

export class Category {
  static async getAll() {
    const [rows] = await pool.query('SELECT * FROM categories ORDER BY name ASC');
    return rows;
  }

  static async getById(id) {
    const [rows] = await pool.query('SELECT * FROM categories WHERE id = ?', [id]);
    return rows[0];
  }

  static async getSubcategories(categoryId) {
    const [rows] = await pool.query(
      'SELECT * FROM subcategories WHERE category_id = ? ORDER BY name ASC',
      [categoryId]
    );
    return rows;
  }

  static async getAllSubcategories() {
    const [rows] = await pool.query(`
      SELECT sc.*, c.name as category_name
      FROM subcategories sc
      JOIN categories c ON sc.category_id = c.id
      ORDER BY c.name, sc.name
    `);
    return rows;
  }
}
