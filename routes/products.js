import express from 'express';
import {allProducts, singleProduct, createProduct, updateProduct, removeProduct} from '../controllers/productsController.js';
const router = express.Router();

router.route('/')
    .get(allProducts)
    .post(createProduct);
router.route('/:id')
    .get(singleProduct)
    .patch(updateProduct)
    .delete(removeProduct);

export default router;