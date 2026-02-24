import express from 'express';
import * as productsController from '../controllers/productsController.js';
import { verifyToken, verifyAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', productsController.getAllProducts);
router.get('/:id', productsController.getProductById);
router.get('/categories/all', productsController.getCategories);
router.get('/categories/:categoryId/subcategories', productsController.getSubcategories);

router.post('/', verifyToken, verifyAdmin, productsController.createProduct);
router.put('/:id', verifyToken, verifyAdmin, productsController.updateProduct);
router.delete('/:id', verifyToken, verifyAdmin, productsController.deleteProduct);

export default router;
