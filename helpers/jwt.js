import jwt from 'jsonwebtoken';

const createJWT = ({ payload }) => {
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "5h" });
    return token;
}

const isValidJwt = ({ token }) => jwt.verify(token, process.env.JWT_SECRET);

const attachCookiesToResponse = ({ res, user}) => {
    const generatedToken = createJWT({ payload: user });
    // console.log(token);
    const oneDay = 1000 * 60 * 60 * 24;
    res.cookie('token', generatedToken, {
        httpOnly: true,
        expires: new Date(Date.now() + oneDay),
        secure: process.env.NODE_ENV === 'production',
        signed: true
    })
}

export { createJWT, isValidJwt, attachCookiesToResponse, };