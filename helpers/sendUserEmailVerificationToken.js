import nodemailer from 'nodemailer';
import User from '../models/users.js'
import {encrypt, decrypt} from './bcrypt.js';
const sendVerificationToken = ({currentUser, emailVerificationToken}) => {
    (async () => {
        const user = await User.findById({ _id: currentUser.userID });
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.NODEMAILER_USER_EMAIL,
                pass: process.env.NODEMAILER_USER_PASS
            },
        });

        
        const mailOptions = {
            from: `"codebro"`, // Sender address
            to: user.email, // List of recipients
            subject: 'Codebro (Verify Your email address)',
            text: `Thank you ${user.username} we are happy to have on board, please verify your email to move to the next stage`, // Subject line
            html: `
            <a href = 'http://localhost:3500/api/v1/auth/verify-email?verificationtoken=${encodeURIComponent(emailVerificationToken)}&userID=${encodeURIComponent(user._id)}' style="background-color: #4CAF50; color: white; font-size: 18px; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verify email with this link</a>
        `, // HTML body
        }

         await transporter.sendMail(mailOptions, (err, info) => {
            if (err) return console.log(err);
            console.log(`Email has been successfully sent`)
        })
    })();
}

export default sendVerificationToken;