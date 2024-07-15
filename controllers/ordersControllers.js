import Order from '../models/orders.js';
import { StatusCodes } from 'http-status-codes';
import User from '../models/users.js'
import { unAuthenticatedError, badRequestError, notFoundError } from '../errors/index.js';

const createOrders = async (req, res) => {
    const {userID, username} = req.user;
    const user = await User.find({_id: userID});
    const role = user[0].role
    if(role === 'seller') throw new unAuthenticatedError('You are not a buyer');
    req.body.boughtBy = userID;
    const order = await Order.create(req.body);
    const noOfItems = order.items.length
    res.status(StatusCodes.CREATED).json({order, "Number of items bought": noOfItems});
}




const seeOrders = async (req, res) => {
    const {userID} = req.user;

    const order = await Order.find({boughtBy: userID});
    if(order.length < 1) throw new notFoundError('You have no orders yet')

    res.status(StatusCodes.OK).json({order})
}

export {createOrders, seeOrders};