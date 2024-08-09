import { StatusCodes } from 'http-status-codes';
import redis from 'redis';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
// import mailjet from 'node-mailjet';
import User from '../models/users.js';
import { createTokenUser, attachCookiesToResponse, generateTokens, sendVerificationToken, decrypt } from '../helpers/index.js';
import { badRequestError, notFoundError, unAuthenticatedError } from '../errors/index.js';
import UnauthenticatedError from '../errors/unAuthenticatedError.js';


// ! Register controller for potential users 
const registerUser = async (req, res) => {

    const { username, email, password } = req.body;
    await User.deleteMany({});
    const isExisting = await User.findOne({
        $or: [{ username: username }, { email: email }]
    });
    if (isExisting) throw new badRequestError('user already exists, Please select different values')
    const isAdmin = (await User.countDocuments({})) <= 3;
    const role = isAdmin ? 'admin' : 'buyer';
    const emailVerified = isAdmin ? true : false;
    const emailVerificationToken = generateTokens(64);
    const createdUser = await User.create({ username, email, password, role, emailVerificationToken, emailVerified });
    const tokenUser = createTokenUser(createdUser);
    attachCookiesToResponse({ res, user: tokenUser });
    await sendVerificationToken({ currentUser: tokenUser, emailVerificationToken });

    const user = await User.findById({ _id: tokenUser.userID });
    res
        .status(StatusCodes.CREATED)
        .json({ user: tokenUser, userDet: user });
}

//! login controller for users 
const log = console.log;
const loginUser = async (req, res) => {
    const { username, password, email } = req.body;
    const identifier = username || email;
    if (!identifier || !password) throw new badRequestError('Please provide username or email and password');
    const user = await User.findOne({
        $or: [{ username: username }, { email: email }]
    });
    if (!user) throw new notFoundError('Invalid credentials');
    const pwdIsCorrect = await user.comparePwd(password);
    if (!pwdIsCorrect) throw new UnauthenticatedError("Invalid credentials");
    const tokenUser = createTokenUser(user);
    attachCookiesToResponse({ res, user: tokenUser });
    res
        .status(StatusCodes.ACCEPTED)
        .json({ user: tokenUser });
}


//! Verify email controller 

const verifyEmail = async (req, res) => {
    let { verificationtoken, userID } = req.query;
    const decodedVerificationToken = decodeURIComponent(verificationtoken);
    const decodedUserID = decodeURIComponent(userID);
    if (!userID) return res.status(StatusCodes.BAD_REQUEST).json({ message: 'validation failed: invalid user' });
    const user = await User.findById({ _id: decodedUserID });
    if (!user) return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Email validation failed' });
    if (user.emailVerified === true) return res.status(StatusCodes.CONFLICT).json('User already verified')
    const validToken = await user.compareEmailVToken(decodedVerificationToken)
    if (!validToken) return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Expired or invalid token' });
    await User.findByIdAndUpdate({ _id: userID }, { emailVerified: true, emailVerificationToken: '' }, { new: true, runValidators: true });
    res.status(StatusCodes.OK).json({ msg: `${user.email} has been successfully verified` })
}



//! logout controller for users 

const logoutUser = async (req, res) => {
    res.cookie('token', 'logout', {
        httpOnly: true,
        expires: new Date(Date.now() + 1000)
    });

    res.status(StatusCodes.OK).json({ message: "logout successful" });
}



export { registerUser, loginUser, verifyEmail, logoutUser };