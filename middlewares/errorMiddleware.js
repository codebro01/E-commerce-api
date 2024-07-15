import {StatusCodes} from 'http-status-codes';

const customErrorHandler = (err, req, res, next) => {
    let errObj = {
        message: err.message || 'An error occured, please try again later',
        statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    }

    return res.status(errObj.statusCode).json(errObj.message);
}

export default customErrorHandler;