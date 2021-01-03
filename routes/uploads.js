const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const { privateUploads, publicUploads } = require("../controllers/uploads");
router.post("/privateUploads", protect, privateUploads);
router.post("/publicUploads", publicUploads);
module.exports = router;
