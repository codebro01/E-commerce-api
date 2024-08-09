import {unAuthenticatedError} from '../errors/index.js'
const checkPermissions = (requestUser) => {
    if(requestUser.role === 'admin' || requestUser.role === 'seller') return;
    if(requestUser.emailVerified === true) return;
    throw new unAuthenticatedError('Become a seller to access this page');
}

export default checkPermissions;