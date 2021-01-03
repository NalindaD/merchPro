const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/User");
const asyncHandler = require("../middleware/async");
const { JWT_COOKIE_EXPIRE } = require("../config/jwtconfig");
const Post = require("../models/Product");

//@desc Register User
//@route POST /api/v1/auth/register
//@access public
exports.registerUser = asyncHandler(async (req, res, next) => {
  const {
    firstName,
    lastName,
    username,
    email,
    password,
    profile,
    role,
  } = req.body;
  //create user
  const user = await User.create({
    firstName,
    lastName,
    username,
    email,
    password,
    profile,
    role,
  });
  //getting token
  sendTokenResponse(user, 200, res);
});

//@desc Login User
//@route POST /api/v1/auth/login
//@access public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  //Validate email and password
  if (!email || !password) {
    return next(new ErrorResponse("Please Provide an email and password", 400));
  }
  //check for user
  /*yahan py hm ny +password is liye use kiya hai q k model men hm ny password ko select
    false rkha huwa h so password select ni hoga is liye hmen usy select krny k liye yeh kaam
    krna pry ga
    */
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorResponse("Invalid Credentials", 401));
  }

  //check if password matches
  const isMatched = await user.matchPassword(password);
  if (!isMatched) {
    return next(new ErrorResponse("Invalid Credentials", 401));
  }
  //getting token

  sendTokenResponse(user, 200, res);
});
//get token from model create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();
  //httpOnly is used that it only used at client side
  const options = {
    expires: new Date(Date.now() + JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };
  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    token,
  });
};

//@desc Get Currently Logged in user
//@route GET /api/v1/auth/me
//@access private
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  console.log("user", user);
  res.status(200).json({
    success: true,
    data: user,
  });
});

//@desc Get Profile of the user user
//@route GET /api/v1/auth/getProfileDetails?username=:username
//@access private
exports.getProfileDetails = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ username: req.query.username });
  res.status(200).json({
    success: true,
    data: user,
  });
});
