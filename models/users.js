import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import validator from 'validator';
import { Timestamp } from 'bson';
const {Schema} = mongoose;
import crypto from 'crypto';

const UserSchema = new Schema({
    username: {
        type: String,
        required: [true, 'Please provide a username'], 
        unique: true,
        trim: true,
        match: [/^\S+$/g, 'No whitespaces allowed in username'],
        minlength: [3, 'Username must be up to three letters'],
        maxlength: [50, 'Username cannot be more than 50 letters'], 
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: 'Please provide a valid email'
        }
    },
    password: {
        type: String,
        required: [true, 'Please provide password'],
        // this match would be used for javascript frontend. 
        // match: [/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{5,}$/, 'Password must contain at least 5 Characters that includes, uppercase, lowercase, number and special characters'],
        minlength: [5, 'Password must be more than 5 characters']
    }, 
    role: {
        type: String,
        default: 'buyer',
        enum: {
            values: ['admin', 'buyer', 'seller'], 
            message:` You are either a buyer or a seller, {VALUES} is not supported`
        },
    },
    emailVerified: {
        type: Boolean,
        default: false
    },
    emailVerificationToken: {
        type: String
    }
}, {timestamps: true})

UserSchema.pre('save', async function() {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    // this.username = await this.username.replace(/\s+/g, '');
});

UserSchema.pre('save', async function() {
    const salt = await bcrypt.genSalt(10);
    this.emailVerificationToken = await bcrypt.hash(this.emailVerificationToken, salt)
})

// UserSchema.methods.createJWT =  function() {
//     const token = jwt.sign({username: this.username, userID: this._id, role: this.role}, process.env.JWT_SECRET, {expiresIn:'5h'});
//     return token;
// }

UserSchema.methods.comparePwd = function(password) {
    const isValid = bcrypt.compare(password, this.password);
    return isValid;
}

UserSchema.methods.compareEmailVToken = function(token) {
    return bcrypt.compare(token, this.emailVerificationToken);
}

export default mongoose.model('User', UserSchema)