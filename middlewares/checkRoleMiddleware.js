import { unAuthenticatedError } from "../errors/index.js";

const checkRole = (req, res, next) => {
    const {role} = req.user;
    if(role === 'buyer') throw new unAuthenticatedError('Switch to seller before seeing all products');
next();
}

export default checkRole;