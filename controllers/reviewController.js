import Review from '../models/review.js';
import Product from '../models/products.js';
import checkPermissions from '../helpers/checkPermissions.js';
import { StatusCodes } from 'http-status-codes';
import { badRequestError, unAuthenticatedError, notFoundError } from '../errors/index.js';
import review from '../models/review.js';
const getAllReview = async (req, res) => {
    const reviews = await Review.find({}).populate({
        path: 'product',
        select: 'name price createdBy'
    });

    res.status(StatusCodes.OK).json({ message: 'success', reviews, count: reviews.length })

}
const createReview = async (req, res) => {
    const { product } = req.body;
    const { userID } = req.user;
    const isValidProduct = await Product.findById({ _id: product });
    if (!isValidProduct) throw new notFoundError(`There is not product with id: ${id}`);

    const alreadySubmitted = await Review.findOne({
        product,
        user: userID
    });
    // user is suppose to be from the body but we are setting the value here to  req.user.userID from the auth middleware


    if (alreadySubmitted) throw badRequestError(`You have already submitted a review for this product`);

    req.body.user = userID;
    const review = await Review.create(req.body);

    res.status(StatusCodes.CREATED).json({ message: 'success', review });
}

const getSingleReview = async (req, res) => {
    const { reviewID } = req.params;
    const review = await Review.findById({ _id: reviewID });
    if (!review) throw new badRequestError(`There is no review with id ${reviewID}`);
    res.status(StatusCodes.OK).json({ message: 'success', review});

}
const updateReview = async (req, res) => {
    const { reviewID } = req.params;
    const review = await Review.findOne({ _id: reviewID });
    if (!review) throw new notFoundError(`There is no review with id ${reviewID}`);
    checkPermissions(req.user);
    const { title, comment, rating } = req.body;
    review.title = title;
    review.comment = comment,
        review.rating = rating

    const updatedReview = await review.save();

    res.status(StatusCodes.OK).json({ message: 'success', review: updatedReview });
}
const deleteReview = async (req, res) => {
    const { reviewID } = req.params;
    // const {userID} = req.user;
    const review = await Review.findOne({ _id: reviewID });
    if (!review) throw new notFoundError(`There is no review with id ${reviewID}`);
    checkPermissions(req.user);
    await review.deleteOne();
    res.status(StatusCodes.OK).json({ message: 'success', removedReview: review })
};

const getSingleProductReview = async (req, res) => {
    const { productID } = req.params;
    const product = await Product.findById({ _id: productID });
    if (!product) throw new notFoundError(`There is no product with id ${productID}`);
    const reviews = await Review.find({ product: productID });
    if (reviews < 1) return res.status(StatusCodes.OK).json({ message: 'There are no reviews for the products yet' });
    res.status(StatusCodes.OK).json({ message: 'success', reviews, count: reviews.length })
}

export { getAllReview, createReview, getSingleReview, updateReview, deleteReview, getSingleProductReview };