const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Product = require("../models/Product");
//@desc Creating product
//@route product /api/v1/product/create
//@access private
exports.createProduct = asyncHandler(async (req, res, next) => {
  const { name, description, image, price } = req.body;
  const createdBy = req.user.id;
  const product = await Product.create({
    name,
    description,
    price,
    image,
    type,
    createdBy,
  });
  return res.status(200).json({
    success: true,
    data: product,
  });
});
//@desc Updating product
//@route put /api/v1/product/updateProduct
//@access private

exports.updateProduct = asyncHandler(async (req, res, next) => {
  const { name, description, image, price, id } = req.body;
  const createdBy = req.user.id;
  const found = Product.findOne({
    _id: id,
    createdBy: createdBy,
  });
  if (!found) {
    return next(
      new ErrorResponse(
        `No product Found Against Your Query Or You are not the owner`,
        404
      )
    );
  }

  const product = await Product.findByIdAndUpdate(id, {
    name,
    description,
    price,
    image,
    type,
  });
  return res.status(200).json({
    success: true,
    data: product,
  });
});

//@desc deleting product
//@route put /api/v1/product/deleteProduct
//@access private
exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.body;
  const createdBy = req.user.id;
  const found = Product.findOne({
    _id: id,
    createdBy: createdBy,
  });
  if (!found) {
    return next(
      new ErrorResponse(
        `No product Found Against Your Query Or You are not the owner`,
        404
      )
    );
  }

  await Product.findByIdAndDelete(id);
  return res.status(200).json({
    success: true,
    data: {},
  });
});

//@desc Getting All products
//@route product /api/v1/product/getAllproducts
//@access private
exports.getAllProducts = asyncHandler(async (req, res, next) => {
  const products = await Product.find({}).populate({
    path: "createdBy",
  });

  return res.status(200).json({
    success: true,
    data: products,
  });
});
//@desc Geting Single product
//@route product /api/v1/product/getproduct/:productId
//@access private
exports.getSingleProduct = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;
  if (!productId) {
    new ErrorResponse(`No productId provided`, 400);
  }
  const product = await Product.findById({ _id: productId });
  if (!product) {
    return next(
      new ErrorResponse(
        `No product Found Against the productId :${productId}`,
        404
      )
    );
  }
  return res.status(200).json({
    success: true,
    data: product,
  });
});
//@desc Get My products
//@route GET /api/v1/products/GetMyproducts
//@access private
exports.getMyProducts = asyncHandler(async (req, res, next) => {
  const products = await Product.find({ createdBy: req.user.id });

  res.status(200).json({
    success: true,
    data: products,
  });
});
