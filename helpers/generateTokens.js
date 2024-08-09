import crypto from 'crypto';
const generateTokens = (bytes) => crypto.randomBytes(bytes).toString('hex'); 
export  {generateTokens};