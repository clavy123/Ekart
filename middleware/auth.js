const jwt =  require('jsonwebtoken')
const User = require('../models/userModel')
const CustomError = require('../utils/customError')

exports.Authentication =  async function(req,res,next){
   const token = req.cookies.token
   console.log(token)
   if(!token){
    return next(new CustomError('Missing Token',400))
   }
   const dryptToken  = jwt.verify(token,process.env.JWT_SECRET_KEY)
   req.user = await User.findById(dryptToken.id)
   console.log(req.user)
   next()

}

exports.customRole = (...roles) => {
      
   return (req, res, next) => {
        console.log(...roles)
     if (!roles.includes(req.user.role)) {
       return next(new CustomError("You are not allowed for this resouce", 403));
     }
     next();
   };
 };