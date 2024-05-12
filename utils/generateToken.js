const dotenv =require("dotenv").config()
const JWT =require('jsonwebtoken')


const generateToken= async(id)=>{
    return await JWT.sign({id},process.env.JWTSECRET,{expiresIn:"2hrs"})
}

module.exports = generateToken;