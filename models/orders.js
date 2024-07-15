import express from 'express';
import mongoose from 'mongoose'
const { Schema } = mongoose;;

const orderSchema = new Schema({
    items: {
        type: Array,
        default: [],
    },
    priceTotal: {
        type: Number,
        default: 0.00
    },
    status: {
        type: String,
        default: 'pending',
        enum: {
            values: ['pending', 'processing', 'shipping', 'delivered'],
            message: [`The product is in process`],
        }
    },

    boughtBy: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'
    }
}, {timestamps: true});

export default mongoose.model('Order', orderSchema)