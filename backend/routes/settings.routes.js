import express from 'express';
import * as settingsController from '../controllers/settingsController.js';
import { verifyToken, verifyAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/shipping-cost', settingsController.getShippingCost);
router.put('/shipping-cost', verifyToken, verifyAdmin, settingsController.updateShippingCost);

export default router;
