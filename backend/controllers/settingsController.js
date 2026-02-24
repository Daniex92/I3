import { Settings } from '../models/Settings.js';

export const getShippingCost = async (req, res) => {
  try {
    const cost = await Settings.getShippingCost();
    res.json({ shipping_cost: cost });
  } catch (error) {
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
};

export const updateShippingCost = async (req, res) => {
  try {
    const { shipping_cost } = req.body;

    if (shipping_cost === undefined || isNaN(parseFloat(shipping_cost))) {
      return res.status(400).json({ error: 'Valid shipping_cost required' });
    }

    await Settings.setShippingCost(shipping_cost);

    res.json({ message: 'Shipping cost updated', shipping_cost: parseFloat(shipping_cost) });
  } catch (error) {
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
};
