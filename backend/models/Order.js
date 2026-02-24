import { pool } from '../config/externalServices.js';

export class Order {
  static async create(orderData, items) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const [orderResult] = await connection.query(
        `INSERT INTO orders (customer_name, customer_email, customer_phone, customer_address, 
         subtotal, shipping_cost, total_price, status) 
         VALUES (?, ?, ?, ?, ?, ?, ?, 'Pendiente')`,
        [
          orderData.customer_name,
          orderData.customer_email,
          orderData.customer_phone,
          orderData.customer_address,
          orderData.subtotal,
          orderData.shipping_cost,
          orderData.total_price,
        ]
      );

      const orderId = orderResult.insertId;

      for (const item of items) {
        await connection.query(
          'INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (?, ?, ?, ?)',
          [orderId, item.product_id, item.quantity, item.unit_price]
        );

        await connection.query(
          'UPDATE products SET stock = stock - ? WHERE id = ?',
          [item.quantity, item.product_id]
        );
      }

      await connection.commit();
      return orderId;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  static async findAll(filters = {}) {
    let query = 'SELECT * FROM orders WHERE 1=1';
    const params = [];

    if (filters.status) {
      query += ' AND status = ?';
      params.push(filters.status);
    }

    query += ' ORDER BY created_at DESC';

    const [rows] = await pool.query(query, params);
    return rows;
  }

  static async findById(id) {
    const [orderRows] = await pool.query('SELECT * FROM orders WHERE id = ?', [id]);
    if (!orderRows[0]) return null;

    const [itemRows] = await pool.query(
      `SELECT oi.*, p.name as product_name 
       FROM order_items oi
       JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id = ?`,
      [id]
    );

    return { ...orderRows[0], items: itemRows };
  }

  static async updateStatus(id, status) {
    const [result] = await pool.query(
      'UPDATE orders SET status = ?, updated_at = NOW() WHERE id = ?',
      [status, id]
    );
    return result;
  }
}
