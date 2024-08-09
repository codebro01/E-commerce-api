import express from "express";
import { createReview, deleteReview, getAllReview, getSingleReview, updateReview, getSingleProductReview} from "../controllers/reviewController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";


const Router = express.Router();

Router.route('/')
    .get(getAllReview)
    .post(authMiddleware, createReview)

Router.route('/:reviewID')
    .get(getSingleReview)
    .patch(authMiddleware, updateReview)
    .delete(authMiddleware, deleteReview);



export default Router;