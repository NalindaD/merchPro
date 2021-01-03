const express = require("express");
const {
  createCategory,
  getAllCategories,
} = require("./../../controllers/admin/category");
const router = express.Router();
router.post("/createCategory", createCategory);
router.get("/getAllCategories", getAllCategories);

module.exports = router;
