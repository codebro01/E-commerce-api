import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { Timestamp } from 'bson';
const {Schema} = mongoose;

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
        match: [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Please insert a valid email'],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Please provide password'],
        // match: [/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{5,}$/, 'Password must contain at least 5 Characters that includes, uppercase, lowercase, number and special characters'],
        minlength: [5, 'Password must be more than 5 characters']
    }, 
    role: {
        type: String,
        default: 'buyer',
        enum: {
            values: ['buyer', 'seller'], 
            message:` You are either a buyer or a seller, {VALUES} is not supported`
        },
    },
}, {timestamps: true})

UserSchema.pre('save', async function() {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    // this.username = await this.username.replace(/\s+/g, '');
});

UserSchema.methods.createJWT =  function() {
    const token = jwt.sign({username: this.username, userID: this._id, role: this.role}, process.env.JWT_SECRET, {expiresIn:'5h'});
    return token;
}

UserSchema.methods.comparePwd = function(password) {
    const isValid = bcrypt.compare(password, this.password);
    return isValid;
}

export default mongoose.model('User', UserSchema)