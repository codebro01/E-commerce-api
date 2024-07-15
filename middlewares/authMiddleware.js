import jwt from 'jsonwebtoken';
import User from '../models/users.js';
import { notFoundError, unAuthenticatedError } from '../errors/index.js';

const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith('Bearer ')) throw new unAuthenticatedError('Acess denied');
    const token = authHeader.split(' ')[1];

    try {
        const decoded = await jwt.verify(token, process.env.JWT_SECRET);
        const {username, userID, role} = decoded;
        const isAvailable = await User.findById(userID);
        if(!isAvailable) throw new notFoundError('User not found')
        req.user = {username, userID}
        next();
    }catch(err) {
        throw new unAuthenticatedError(`Access denied: ${err}`);
    }
} 

export default authMiddleware;