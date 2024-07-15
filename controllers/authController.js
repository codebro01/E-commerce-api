import {StatusCodes} from 'http-status-codes';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/users.js';
import { badRequestError, notFoundError, unAuthenticatedError } from '../errors/index.js';
import UnauthenticatedError from '../errors/unAuthenticatedError.js';

const registerUser = async (req, res) => {
    // await User.deleteMany({});
    const createdUser = await User.create({...req.body});
    const token = await createdUser.createJWT();
    res
        .status(StatusCodes.CREATED)
        .json({username: {name: createdUser.username}, token});
}

const loginUser = async (req, res) => {
    const {username, password, email} = req.body;
    const identifier = username || email;
    if(!identifier || !password) throw new badRequestError('Please provide username or email and password');
    const user = await User.findOne({
        $or: [{username: username}, {email: email}]
    });
    if(!user) throw new notFoundError('Invalid credentials');
    const pwdIsCorrect = await user.comparePwd(password);
    if(!pwdIsCorrect) throw new UnauthenticatedError("Invalid credentials");
    const token = user.createJWT()
    console.log(req.headers.authorization);
    res.status(StatusCodes.ACCEPTED).json({user: {username: user.username,email: user.email}, token: token});
}

export {registerUser, loginUser};