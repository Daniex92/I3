import { pool } from '../config/externalServices.js';

export class Settings {
  static async get(key) {
    const [rows] = await pool.query('SELECT setting_value FROM settings WHERE setting_key = ?', [key]);
    return rows[0]?.setting_value || null;
  }

  static async update(key, value) {
    const [result] = await pool.query(
      'INSERT INTO settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?',
      [key, value, value]
    );
    return result;
  }

  static async getShippingCost() {
    const cost = await this.get('shipping_cost');
    return parseFloat(cost) || 10.0;
  }

  static async setShippingCost(cost) {
    return this.update('shipping_cost', parseFloat(cost).toString());
  }
}
