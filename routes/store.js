import express from 'express';
import {getAllStoreProducts, queryProducts} from '../controllers/storeController.js';
const router = express.Router();

 router.route('/').get(getAllStoreProducts)
 router.route('/search').get(queryProducts);

 export default router;