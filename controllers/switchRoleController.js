import User from '../models/users.js'
import Product from '../models/products.js';
import { StatusCodes } from 'http-status-codes';
import { badRequestError } from '../errors/index.js';

const buyer = async (req, res) => {

    const {userID, username, role} = req.user;

    const sellerRole = await User.find({_id: userID});
    if(sellerRole[0].role === 'buyer') throw new badRequestError('User is already a buyer')

    const switchRole = await User.findOneAndUpdate({_id: userID}, {role: 'buyer'}, {runValidators: true, new: true});
    
    res.status(StatusCodes.OK).json({username: switchRole.username, newRole: switchRole.role})
}
//! switch to seller here
const seller = async (req, res) => {

        const {userID, username, role} = req.user;

        const sellerRole = await User.find({_id: userID});
        if(sellerRole[0].role === 'seller') throw new badRequestError('User is already a seller')

        const switchRole = await User.findOneAndUpdate({_id: userID}, {role: 'seller'}, {runValidators: true, new: true});
        
        res.status(StatusCodes.OK).json({username: switchRole.username, newRole: switchRole.role})

}




export {buyer, seller};