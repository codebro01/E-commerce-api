import express from 'express';
import { allProducts, singleProduct, createProduct, updateProduct, removeProduct } from '../controllers/productsController.js';
import { upload } from '../config/multer.js';
import { getSingleProductReview } from '../controllers/reviewController.js';
const router = express.Router();
const uploadSingle = upload.array('image', 5)
router.route('/')
    .get(allProducts)
// router.route('/', multerConfig).post(createProduct)
router.post('/', uploadSingle , createProduct)
router.route('/:id')
    .get(singleProduct)
    .patch(updateProduct)
    .delete(removeProduct);
router.route('/:productID/reviews')
.get(getSingleProductReview);

export default router;