const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const {
  createProduct,
  getMyProducts,
  getAllProducts,
  getSingleProduct,
} = require("../controllers/product");

router.post("/createProduct", protect, createProduct);
router.get("/getMyProducts", protect, getMyProducts);
router.get("/getAllProducts", protect, getAllProducts);
router.get("/getSingleProduct/:productId", protect, getSingleProduct);

module.exports = router;
