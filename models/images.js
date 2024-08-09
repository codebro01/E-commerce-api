import mongoose, { mongo } from "mongoose";
const Schema = mongoose.Schema;

const imagesSchema = new Schema({
    imageUrl: {
        type: String
    },
    imagePublicId: {
        type: String
    },
    product: {
       type: mongoose.Schema.Types.ObjectId, 
       ref: 'Product' 
    },
})

export default mongoose.model('Images', imagesSchema)