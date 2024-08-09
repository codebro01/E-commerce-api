import { isValidJwt } from '../helpers/index.js';
import User from '../models/users.js';
import { notFoundError, unAuthenticatedError } from '../errors/index.js';
import UnauthenticatedError from '../errors/unAuthenticatedError.js';

const authMiddleware = async (req, res, next) => {
    const token = req.signedCookies.token

    if (!token) throw new unAuthenticatedError('Authentification Invalid')

    try {
        const decoded = isValidJwt({ token });
        const { username, userID, role, email } = decoded;
        const isAvailable = await User.findById(userID);
        if (!isAvailable) throw new notFoundError('User not found')
        req.user = { username, email, userID, role }
        next();
    } catch (err) {
        throw new unAuthenticatedError(`Access denied: ${err}`);
    }
}

const checkPermissions = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) throw new UnauthenticatedError('Unauthorized to access this route')
        next();
    }
}

export { authMiddleware, checkPermissions };