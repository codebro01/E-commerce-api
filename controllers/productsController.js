import User from '../models/users.js'
import Product from '../models/products.js';
import { StatusCodes } from 'http-status-codes';
import { notFoundError, unAuthenticatedError } from '../errors/index.js';
import populate from '../populate.js';

    const allProducts = async (req, res) => {
        // req.body.createdBy = req.user.userID;
        const {userID, username} = req.user;
        const user = await User.find({_id: userID});
        const role = user[0].role
        if(role === 'buyer') throw new unAuthenticatedError('Switch to seller before seeing all products');
        const products = await Product.find({createdBy: userID}).sort('CreatedAt');
        res.status(StatusCodes.OK).json({products: products, count: products.length} );
    }
    
    const createProduct = async (req, res) => {
        // await Product.deleteMany({});
        // if(role === 'buyer') throw new UnauthenticatedError('Switch to seller before seeing all products');
        const {userID, username} = req.user;
        req.body.createdBy = userID;
        const product = await Product.create(req.body);
        // await Product.deleteMany({});
        // const product = await Product.insertMany(populate);
        res.status(StatusCodes.CREATED).json({Message: `Product successfully uploaded`, product: product});
    }
    
    
    const singleProduct = async (req, res) => {
        // const {userID, username} = req.user;
        // const productID = req.params.id;
        const {user: {userID}, params: {id: productID}} = req;
        const product = await Product.findOne({_id: productID, createdBy: userID});
        if(!product) throw new notFoundError('Product not found');
        res.status(StatusCodes.OK).json({product: product});
    }
    
    
    const updateProduct = async (req, res) => {
        const {user: {userID}, params: {id: productID}} = req;
    
        const product = await Product.findOneAndUpdate({
            _id: productID,
            createdBy: userID
        }, req.body, {new: true, runValidators: true});
        if(!product) throw new notFoundError('Product not found');
        res.status(StatusCodes.OK).json({product: product});
    
    }
    
    
    const removeProduct = async (req, res) => {
        const {user: {userID}, params: {id: productID}} = req;
    
        const productDeleted = await Product.findByIdAndDelete({
            _id: productID,
            createdBy: userID   
        })
        if(!productDeleted) throw new notFoundError('Product not found');
        const product = await Product.find({createdBy: userID})
        res.status(StatusCodes.OK).json({"successful": `${productDeleted.name} has been deleted`, "Remaining Products": product});
    }


export {allProducts, createProduct, singleProduct, updateProduct, removeProduct}
