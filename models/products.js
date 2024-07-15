import mongoose from "mongoose";
const {Schema} = mongoose;

const ProductSchema = new Schema({
    name: {
        type: String,
        required: [true, 'please set product name'], 
        maxlength: 300
    },
    price: {
        type: Number,
        required: [true, 'please set product price'], 
    },
    discount: {
        type: Number,
        default: 0,
    },
    description: {
        type: String, 
        required: true
    },
    group: {
        type: String, 
        default:'others', 
        enum: ['gadgets', 'electronics', 'vehicles', 'clothings', 'home and kitchen equipments', 'books', 'others']
    },
    inStock: {
        type: Boolean, 
        default: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
    

}, {timestamps: true})

export default mongoose.model('Product', ProductSchema);