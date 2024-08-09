import {StatusCodes} from 'http-status-codes';

const customErrorHandler = (err, req, res, next) => {
    let errObj = {
        message: err.message || 'An error occured, please try again later',
        statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    }

    if(err.code && err.code === 11000) {
        errObj.message = `${Object.values(err.keyValue)} already Exists, Please select another ${Object.keys(err.keyValue)}`;
        errObj.statusCode = 400
    }

    if(err.name === 'CastError') {
        errObj.msg = `No item found with id : ${err.value}`;
        errObj.statusCode = 404;
    }

    return res.status(errObj.statusCode).json(errObj.message);
}

export default customErrorHandler;