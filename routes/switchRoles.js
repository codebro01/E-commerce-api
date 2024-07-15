import express from 'express';
import {seller, buyer} from '../controllers/switchRoleController.js';
const router = express.Router();


router.patch('/seller', seller);
router.patch('/buyer', buyer)
export default router;