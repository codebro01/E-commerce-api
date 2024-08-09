import bcrypt from  'bcryptjs';

const encrypt = async (input) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(`${input}`, salt) 
     
}

const decrypt = async (input, dbEmailToken) => {
    return bcrypt.compare(`${input}`, `${dbEmailToken}`)
}





export {encrypt, decrypt};