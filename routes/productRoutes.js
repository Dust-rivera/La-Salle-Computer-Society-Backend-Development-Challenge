import express from 'express';
import {
  getAllProducts,
  getOneProduct,
  addProduct,
  updateProduct,
  removeProduct,
} from '../controllers/productController.js';

const router = express.Router();

router.get('/', getAllProducts);
router.get('/:id', getOneProduct);
router.post('/', addProduct);
router.put('/:id', updateProduct);
router.delete('/:id', removeProduct);

export default router;
