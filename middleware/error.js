const ErrorResponse = require("../utils/errorResponse");
const errorHandler = (err, req, res, next) => {
  //log to console for dev
  //mongo bad id
  let error = { ...err };
  error.message = err.message;
  if (err.name === "CastError") {
    console.log("error", err.value);
    const message = `Resource Not Found against this ${err.value}`;
    error = new ErrorResponse(message, 404);
  }
  //duplicate key error

  if (err.code === 11000) {
    let messageText = "";
    messageText = "Duplicate Key Value Entered for Email";
    const message = messageText;
    error = new ErrorResponse(message, 400);
  }
  //validation on Fields if ther user not enetering the data
  //validation error
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map((val) => val.message);
    error = new ErrorResponse(message, 400);
  }
  res
    .status(error.statusCode || 500)
    .json({ success: false, error: error.message || "Server Error" });
};
module.exports = errorHandler;
