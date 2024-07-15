import express from 'express';
import {seeOrders, createOrders} from '../controllers/ordersControllers.js';
const router = express.Router();

 router.route('/')
    .get(seeOrders)
    .post(createOrders)

 export default router;