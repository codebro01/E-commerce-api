import express from 'express';
import { getAllUsers, getSingleUser, getCurrentUser, updateUserInfo, updateUserPwd } from '../controllers/userController.js';
import {authMiddleware,checkPermissions} from '../middlewares/authMiddleware.js'

const Router = express.Router();

Router.route('/')
    .get(authMiddleware,checkPermissions('admin'), getAllUsers)
Router.route('/current-user')
    .get(authMiddleware, getCurrentUser);
Router.route('/updatePwd')
    .patch(authMiddleware, updateUserPwd)
Router.route('/updateinfo')
    .patch(authMiddleware, updateUserInfo)
Router.get('/:userID', authMiddleware, getSingleUser)

export default Router;