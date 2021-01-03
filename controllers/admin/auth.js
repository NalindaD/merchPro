const ErrorResponse = require("../../utils/errorResponse");
const Admin = require("../../models/Admin");
const asyncHandler = require("../../middleware/async");
const { JWT_COOKIE_EXPIRE } = require("../../config/jwtconfig");

//@desc Seed Admin
//@route POST /api/v1/admin/auth/register
//@access No One
exports.registerAdmin = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  //create user
  const user = await Admin.create({
    email,
    password,
  });
  //getting token
  sendTokenResponse(user, 200, res);
});

//@desc Login Admin
//@route POST /api/v1/admin/auth/login
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
  const user = await Admin.findOne({ email }).select("+password");
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
