const mongoose = require("mongoose");
const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please Add a post name"],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "No Category Added"],
    },
    type: {
      type: Boolean,
      default: true,
    },
    description: {
      type: String,
      required: [true, "Please Add a post description"],
      maxlength: [1200, "Description must be less than 1200 charaters"],
    },
    image: {
      type: String,
      default: null,
    },

    price: {
      type: Number,
      default: 0,
    },
    status: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Post Can Not be created no owner identified"],
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

module.exports = mongoose.model("Product", ProductSchema);
