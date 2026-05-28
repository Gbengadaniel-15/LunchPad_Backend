import jwt from 'jsonwebtoken'


const generateToken = (userId) => {
    try{
    return jwt.sign(
        {id: userId },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN}

    )
    }catch (error){
        throw new Error('Token generation failed')
    }
}


export default generateToken