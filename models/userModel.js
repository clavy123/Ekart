const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require('jsonwebtoken')

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name field is required"],
    maxLength: [30, "Name is limited to 30 character"],
    minLength: [4, "Name should be at least 4 characters long"],
  },
  email: {
    type: String,
    required: [true, "Email field is required"],
    validate: [validator.isEmail, "Please enter a valid email address"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password field is required"],
    maxLength: [30, "Password is limited to 30 character"],
    minLength: [4, "Password should be at least 4 characters long"],
    select: false,
  },
  role: {
    type: String,
    default: "user",
  },
  photo: {
    id: {
      type: String,
      required: true,
    },
    secure_url: {
      type: String,
      required: true,
    },
  },
  forgotPasswordToken: String,
  forgotPasswordExpiry:{
    type:Date,
  },
  createdAt: Date,
});

//encrypt password before saving document
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

//validate password with user password
UserSchema.methods.IsValidatePassword = async function (userPassword) {
  return await bcrypt.compare(userPassword, this.password);
};

//generate forgot password token
UserSchema.methods.generateForgotPasswordToken = function () {
  const forgotToken = crypto.randomBytes(20).toString("hex");
  this.forgotPasswordToken = crypto
    .createHash("sha256")
    .update(forgotToken)
    .digest("hex");
  this.forgotPasswordExpiry = Date.now() + 3600000;
  console.log(this.forgotPasswordExpiry)
  return forgotToken
};

//creating jwt token
UserSchema.methods.generateJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

module.exports = mongoose.model("User", UserSchema);
