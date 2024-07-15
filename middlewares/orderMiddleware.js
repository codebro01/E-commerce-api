import express from 'express';
const router = express.Router();

router.route('/orders')
    .get()
    .post();

export default router;