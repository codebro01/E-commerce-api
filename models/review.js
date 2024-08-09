import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import { StatusCodes } from 'http-status-codes';
import { badRequestError } from '../errors/index.js';

const reviewSchema = new Schema({
    rating: {
        type: Number,
        min: [1, 'Minimum rating is 1'],
        max: [5, 'Maximum rating is 5'],
        required: [true, 'Please provide rating'], 
    },
    title: {
        type: String,
        required: [true, 'Please provide review title'],
        maxlength:  100,
        trim: true,
    },
    comment: {
        type: String, 
        required: [true, 'Please enter a comment'],
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true,
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product', 
        required: true
    }
},{ timestamps: true});

reviewSchema.index({product: 1, user: 1}, {unique: true});

reviewSchema.statics.calcAvgRating = async function(productID) {
    const result = await this.aggregate([
        {
            $match: {product: productID},
        }, 
        {
            $group: {
                _id: null, 
                avgRating: {$avg: '$rating'},
                totalRev: {$sum: 1}
            }
        },
    ]);

    try {
        await this.model('Product').findOneAndUpdate({_id: productID}, {avgRating: Math.round(result[0]?.avgRating || 0), noOfReviews: result[0]?.totalRev || 0})
    } catch (err) {
        console.log(err);
        throw new badRequestError("Internal Server Error")
    }
}

reviewSchema.post('save', async function() {
    await this.constructor.calcAvgRating(this.product)
})
reviewSchema.post('remove', async function() {
    await this.constructor.calcAvgRating(this.product)
})

export default mongoose.model('Review', reviewSchema);

