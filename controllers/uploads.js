const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const path = require("path");

//@desc Upload Private Assets
//@route POST /api/v1/uploads/privateUploads
//@access private

exports.privateUploads = asyncHandler(async (req, res, next) => {
  if (!req.files) {
    return next(new ErrorResponse(`Please upload a file`, 400));
  }

  const file = req.files.privateUplaod;
  if (!file) {
    return next(new ErrorResponse(`Please upload a file`, 400));
  }
  // Make sure the image is a photo
  // Check filesize
  if (!file.mimetype.startsWith("image")) {
    if (file.size > 1000000) {
      return next(
        new ErrorResponse(`Please upload an image less than 1MB`, 400)
      );
    }
  } else if (!file.mimetype.startsWith("video")) {
    if (file.size > 50000000) {
      return next(
        new ErrorResponse(`Please upload an image less than 50MB`, 400)
      );
    }
  }
  const timeNow = Date.now();
  console.log(timeNow);
  file.name = `file-${Math.random(1, 100000)}-${timeNow}-uploads-${Math.random(
    1,
    100000
  )}${path.parse(file.name).ext}`;

  file.mv(`./public/uploads/${file.name}`, async (err) => {
    if (err) {
      console.error(err);
      return next(new ErrorResponse(`Problem with file upload`, 500));
    }

    res.status(200).json({
      success: true,
      data: file.name,
    });
  });
});

//@desc Upload Public Assets
//@route POST /api/v1/uploads/publicUploads
//@access public
exports.publicUploads = asyncHandler(async (req, res, next) => {
  if (!req.files) {
    return next(new ErrorResponse(`Please upload a file`, 400));
  }

  const file = req.files.publicUpload;
  if (!file) {
    return next(new ErrorResponse(`Please upload a file`, 400));
  }
  // Make sure the image is a photo
  // Check filesize
  if (!file.mimetype.startsWith("image")) {
    if (file.size > 1000000) {
      return next(
        new ErrorResponse(`Please upload an image less than 1MB`, 400)
      );
    }
  } else if (!file.mimetype.startsWith("video")) {
    if (file.size > 50000000) {
      return next(
        new ErrorResponse(`Please upload an image less than 50MB`, 400)
      );
    }
  }
  const timeNow = Date.now();
  console.log(timeNow);
  file.name = `file-${Math.random(1, 100000)}-${timeNow}-uploads-${Math.random(
    1,
    100000
  )}${path.parse(file.name).ext}`;

  file.mv(`./public/uploads/${file.name}`, async (err) => {
    if (err) {
      console.error(err);
      return next(new ErrorResponse(`Problem with file upload`, 500));
    }

    res.status(200).json({
      success: true,
      data: file.name,
    });
  });
});
