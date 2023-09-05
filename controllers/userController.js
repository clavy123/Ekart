const User = require("../models/userModel");
const BigPromise = require("../middleware/promise");
const CustomError = require("../utils/customError");
const cookieToken = require("../utils/cookietToken");
const cloudinary = require("cloudinary");
const mailHelper = require("../utils/emailHelper");
const crypto = require("crypto")

exports.signup = BigPromise(async function (req, res, next) {
  const { name, email, password } = req.body;
  if (!req.files) {
    return next(new CustomError("photo is required for signup", 400));
  }
  let file = req.files.photo;
  const result = await cloudinary.v2.uploader.upload(file.tempFilePath, {
    folder: "users",
    width: 150,
    crop: "scale",
  });

  if (!(email || password)) {
    return next(new CustomError("Please Eneter the email", 400));
  }
  const user = await User.create({
    name,
    email,
    password,
    photo:{
      id:result.public_id,
      secure_url:result.secure_url
    }
  });
  cookieToken(user, res);
});

exports.signin = BigPromise(async function(req,res,next){
     const {email,password}  = req.body
     if(!(email || password)){
      return next(new CustomError("Please provied email and password",400))
     }
     const user = await User.findOne({email}).select('+password')
     if(!user){
      return next(new CustomError("email and password required",400))
     }
     const isPasswordMatched = await user.IsValidatePassword(password)
     if(!isPasswordMatched){
      return next(new CustomError("Pasword does not match",400))
     }
     cookieToken(user,res)
})

exports.signout = BigPromise(async function(req,res,next){
  res.cookie('token',null,{
    expires : new Date(Date.now()),
    httpOnly:true,
  })
  res.status(200).json({
    success:true,
  })
  
})

exports.forgotpassword = BigPromise(async function(req,res,next){
     const{email} = req.body
     const user = await User.findOne({email}).select('-password')
 
     const forgotPasswordTokenUser =  user.generateForgotPasswordToken()
     user.save({validateBeforeSave:false})

    const url = `${req.protocol}://${(req.hostname)}/password/reset/${forgotPasswordTokenUser}`
    const message = `copy paste this url to your browser and hit enter \n\n ${url}`
    try{
      mailHelper({
        email:user.email,
        subject:"Email is sent",
        message,
      })
      res.status(200).json({
        success:true,
        message:'email sent succssfully'
      })
    }
    catch(error){
      user.forgotPasswordToken = undefined
      user.forgotPasswordExpiry = undefined
      await user.save({validateBeforeSave:false})
      return next(new CustomError(error.message,500))
    }
})

exports.resetPassword = BigPromise(async (req,res,next) =>{
  const token = req.params.token
  const updateToken =  crypto
  .createHash("sha256")
  .update(token)
  .digest("hex");
  const user = await User.findOne({
    forgotPasswordToken:updateToken,
   forgotPasswordExpiry:{$gt : Date.now()}
  })
  if(!user){
    return next(new CustomError("Token is invalid or expired",400))
  }
  if(req.body.password !== req.body.confirmPassword){
      return next(new CustomError("Password doesn not match",400))
  }
  
 user.password = req.body.password
 this.forgotPasswordToken = undefined
 this.forgotPasswordExpiry = undefined
 await user.save()
 cookieToken(user,res)

})

exports.getUserDashboard = BigPromise(async (req,res,next) => {
  const user = User.findById(req.user.id)
  res.status(200).json({
    success:true,
    user
  })
})

exports.updatePassword = BigPromise(async (req,res,next) => {
    const userId = req.user.id

    const user = await User.findById(userId).select("+password")
    const IsCorrectPassword = await user.IsValidatePassword(req.body.oldPassword)
    if(!IsCorrectPassword){
      return next(new CustomError("old Password is incorrect",400))
    }
    user.password = req.body.oldPassword
    await user.save()
    cookieToken(user,res)

})

exports.updateUserProfile = BigPromise(async (req,res,next) => {
   const newData = {
    name:req.body.name,
    email:req.body.email
   }
 
    if(req.files){
      const user  = await User.findById(req.user.id)
      const imageId = user.photo.id
      const resp = await cloudinary.v2.uploader.destroy(imageId)
      const result = await cloudinary.v2.uploader.upload(req.files.photo.tempFilePath, {
        folder: "users",
        width: 150,
        crop: "scale",
      });
      newData.photo = {
        id:result.public_id,
        secure_url:result.secure_url
      }
    }
   const user = await User.findByIdAndUpdate(req,user.id,newData,{
    new:true,
    runValidators:true,
   })
   res.status(200).json({
    success:true,
   })
})

exports.adminUserDetails = BigPromise(async (req,res,next) => {
  const user = await User.find()
  res.send(200).json({
    success:true,
    user
  })
})

exports.adminGetUserSingleDetail = BigPromise(async (req,res,next) => {
   const user = await User.findById(req.params.id)
   res.send(200).json({
    success:true,
    user
   })
})