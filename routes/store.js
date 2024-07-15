import express from 'express';
import {getAllStoreProducts, queryProducts} from '../controllers/storeController.js';
const router = express.Router();

 router.route('/').get(getAllStoreProducts)
 router.route('/query').get(queryProducts);

 export default router;