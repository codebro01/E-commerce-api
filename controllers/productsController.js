import User from '../models/users.js'
import Product from '../models/products.js';
import Image from '../models/images.js';
import { StatusCodes } from 'http-status-codes';
import { badRequestError, notFoundError, unAuthenticatedError } from '../errors/index.js';
import checkPermissions from '../helpers/checkPermissions.js';
import cloudinary from '../config/cloudinary.js';
import { generateTokens } from '../helpers/generateTokens.js';
import multer, { memoryStorage } from 'multer';
// import populate from '../populate.js';


//! Get all users products 
const allProducts = async (req, res) => {
    // req.body.createdBy = req.user.userID;
    const { userID, username } = req.user;
    const user = await User.findById({ _id: userID });
    console.log(user);
    // const role = user.role
    // if (role === 'buyer') throw new unAuthenticatedError('Switch to seller before seeing all products');
    checkPermissions(user);
    const products = await Product.find({ createdBy: userID }).sort('CreatedAt');
    res.status(StatusCodes.OK).json({ products: products, count: products.length });
}


//! Create products 
const createProduct = async (req, res) => {
    // await Product.deleteMany({});
    // if(role === 'buyer') throw new UnauthenticatedError('Switch to seller before seeing all products');

    const { userID, username } = req.user;
    const user = await User.findById({ _id: userID });
    checkPermissions(user)
    req.body.createdBy = userID;
    await Product.deleteMany({ createdBy: userID });
    (async function () {
        const images = req.files;
        const maxSize = 1024 * 1024;
        images.forEach(image => {
            if (image.mimetype !== 'image/jpeg') throw new badRequestError('Please uplaod an image file');
        })
        images.forEach(image => {
            if (!image) throw new badRequestError('Please choose an image');
        });

        images.forEach(image => {
            if (image.size >= maxSize) throw new badRequestError('image size too large, please upload image smaller than 1mb');
        })
        const product = await Product.create(req.body);
        await Image.deleteMany({});
        const uploadPromises = images.map(async image => {
            try {
                const customCloudinaryPublicId = `${generateTokens(16)}_${Date.now()}`;

                const cloudinaryUpload = await cloudinary.uploader.upload(image.path, {
                    public_id: customCloudinaryPublicId,
                    folder: 'product_images',
                })
                await Image.create({
                    imageUrl: cloudinaryUpload.secure_url,
                    imagePublicId: cloudinaryUpload.public_id,
                    product: product._id,
                })
            } catch (error) {
                console.log('an error occured when trying to upload to either cloudinary or db' + error)
            }
        })

        try {
            await Promise.all(uploadPromises);
            const uploadedImages = await Image.find({product: product._id});
            const updatedProduct = await Product.findOneAndUpdate({_id: product._id}, {imagesDetails: uploadedImages}, {new: true, runValidators: true});

            console.log('all images successfully uploaded');
            res.status(StatusCodes.CREATED).json({productImage: updatedProduct})
        }catch(err) {
            console.log(err);
        }
    })();
}

//! Get user's single product
const singleProduct = async (req, res) => {
    // const {userID, username} = req.user;
    // const productID = req.params.id;
    const { user: { userID }, params: { id: productID } } = req;
    const user = await User.findById({ _id: userID });
    checkPermissions(user)

    const product = await Product.findOne({ _id: productID, createdBy: userID });
    if (!product) throw new notFoundError('Product not found');
    res.status(StatusCodes.OK).json({ product: product });
}



//! Update products 
const updateProduct = async (req, res) => {
    const { user: { userID }, params: { id: productID } } = req;
    const user = await User.findById({ _id: userID });
        checkPermissions(user)

    const product = await Product.findOneAndUpdate({
        _id: productID,
        createdBy: userID
    }, req.body, { new: true, runValidators: true });
    if (!product) throw new notFoundError('Product not found');
    res.status(StatusCodes.OK).json({ product: product });

}


//! Delete products 
const removeProduct = async (req, res) => {
    const { user: { userID }, params: { id: productID } } = req;
    const user = await User.findById({ _id: userID });
        checkPermissions(user)

    const productDeleted = await Product.findByIdAndDelete({
        _id: productID,
        createdBy: userID
    })
    if (!productDeleted) throw new notFoundError('Product not found');
    const product = await Product.find({ createdBy: userID })
    res.status(StatusCodes.OK).json({ "successful": `${productDeleted.name} has been deleted`, "Remaining Products": product });
}


export { allProducts, createProduct, singleProduct, updateProduct, removeProduct }
