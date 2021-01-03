const ErrorResponse = require("../../utils/errorResponse");
const Category = require("../../models/Category");
const asyncHandler = require("../../middleware/async");

//@desc Creating Category
//@route post /api/v1/admin/category/create
//@access private
exports.createCategory = asyncHandler(async (req, res, next) => {
  const { name } = req.body;
  const category = await Category.create({
    name,
  });
  return res.status(200).json({
    success: true,
    data: category,
  });
});

//@desc Getting Categories
//@route get /api/v1/admin/category/getAllCategories
//@access private
exports.getAllCategories = asyncHandler(async (req, res, next) => {
  const categories = await Category.find({});
  return res.status(200).json({
    success: true,
    data: categories,
  });
});
