import { Order } from '../models/Order.js';
import { Product } from '../models/Product.js';
import { Settings } from '../models/Settings.js';
import { FORMSPREE_ENDPOINT } from '../config/externalServices.js';
import fetch from 'node-fetch';

export const createOrder = async (req, res) => {
  try {
    const { customer_name, customer_email, customer_phone, customer_address, items } = req.body;

    if (!customer_name || !customer_email || !customer_phone || !customer_address || !items || items.length === 0) {
      return res.status(400).json({ error: 'Missing required fields or empty cart' });
    }

    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product_id);
      if (!product) {
        return res.status(404).json({ error: `Product ${item.product_id} not found` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({ error: `Insufficient stock for ${product.name}` });
      }

      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: product.price,
      });
    }

    const shipping_cost = await Settings.getShippingCost();
    const total_price = subtotal + shipping_cost;

    const orderId = await Order.create(
      {
        customer_name,
        customer_email,
        customer_phone,
        customer_address,
        subtotal,
        shipping_cost,
        total_price,
      },
      orderItems
    );

    const orderItemsFormatted = orderItems
      .map((item) => `- Producto ID: ${item.product_id} | Cantidad: ${item.quantity} | Precio unitario: $${item.unit_price.toFixed(2)}`)
      .join('\n');

    const formspreeData = {
      customer_name,
      customer_email,
      customer_phone,
      customer_address,
      order_id: orderId,
      items: orderItemsFormatted,
      subtotal: `$${subtotal.toFixed(2)}`,
      shipping_cost: `$${shipping_cost.toFixed(2)}`,
      total_price: `$${total_price.toFixed(2)}`,
      _subject: `Nueva Orden #${orderId} - Raíz Store`,
      _replyto: customer_email,
    };

    try {
      const formspreeResponse = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formspreeData),
      });

      if (!formspreeResponse.ok) {
        console.error('Formspree error:', await formspreeResponse.text());
      }
    } catch (formspreeError) {
      console.error('Error sending to Formspree:', formspreeError.message);
    }

    res.status(201).json({
      message: 'Order created successfully',
      order_id: orderId,
      total_price,
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
};

export const getOrders = async (req, res) => {
  try {
    const { status } = req.query;
    const filters = {};
    if (status) {
      filters.status = status;
    }

    const orders = await Order.findAll(filters);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Status required' });
    }

    const validStatuses = ['Pendiente', 'Pagado', 'Enviado', 'Entregado', 'Cancelado'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    await Order.updateStatus(id, status);

    res.json({ message: 'Order status updated' });
  } catch (error) {
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
};
