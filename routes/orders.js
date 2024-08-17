import express from 'express';
import {seeOrders, createOrders} from '../controllers/ordersControllers.js';
import paymentController from '../controllers/paymentController.js';
const router = express.Router();

 router.route('/')
    .get(seeOrders)
    .post(createOrders);
router.route('/payment')
   .post(paymentController);

 export default router;