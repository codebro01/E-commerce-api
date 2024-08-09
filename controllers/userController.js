import User from '../models/users.js';
import {attachCookiesToResponse, sendVerificationToken, createTokenUser, generateTokens} from '../helpers/index.js';
import { StatusCodes } from 'http-status-codes';
import { unAuthenticatedError, badRequestError, notFoundError } from '../errors/index.js';
const getAllUsers = async (req, res) => {
    const users = await User.find({
        $or: {role: 'buyer', role: 'seller'}
    }).select('-password');

    res.status(StatusCodes.OK).json({message: 'sucess', users, count: users.length});
}
const getSingleUser = async(req, res) =>{
    const {userID} = req.params;
    const user = await User.findById({_id: userID}).select('-password');
    if(!user) throw new notFoundError(`User with id: ${userID} does not exist`);
    
    if(user._id.toString() !== userID) throw new unAuthenticatedError('Not authorized to access this route')
    res.status(StatusCodes.OK).json({message: 'sucess', user});

}
const getCurrentUser = async (req, res) => {
    res.status(StatusCodes.OK).json({user: req.user});
}
const updateUserPwd = async (req, res) => {
    const {oldPassword, newPassword} = req.body;
    if(!oldPassword || !newPassword) throw new badRequestError('Both values are required');
    const {userID} = req.user;
    const user = await User.findById({_id: userID});
    const isCorrectPwd = await user.comparePwd(oldPassword);
    if(!isCorrectPwd) return res.status(StatusCodes.BAD_REQUEST).json('Incorrect Password, please provide correct password');
    if(isCorrectPwd === newPassword) return res.status(StatusCodes.BAD_REQUEST).json('please, choose a password different from the old old');
    user.passsword = newPassword;
    await user.save();
    res.status(StatusCodes.OK).json({message: 'success, password successfully changed', updatedUser: req.user});
}

const updateUserInfo = async (req, res) => {
    try {
        const {username, email} = req.body;
        if(!username || !email) throw new badRequestError('Please email and username is required');
        const {userID, username: currentUsername, email: currentEmail} = req.user;
        const user = await User.findById({_id: userID});
        if(currentUsername === username || currentEmail === email) return res.status(StatusCodes.CONFLICT).json('Please use username and emails different from the existing ones');
        user.email = email,
        user.username = username;
        user.emailVerified = false;
        await user.save();
        const emailVerificationToken = generateTokens(64);
        const tokenUser = createTokenUser(user);
        console.log(tokenUser);
        attachCookiesToResponse({res, user: tokenUser});
        await sendVerificationToken({ currentUser: tokenUser, emailVerificationToken });
        res.status(StatusCodes.OK).json({message: 'success, check email to verify verify your email', "New Email": user.email, "New username": user.username});
    } catch (error) {
        console.log(error);
        
    }
}

export {getAllUsers, getSingleUser, getCurrentUser, updateUserInfo, updateUserPwd}
