const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { JWT_EXPIRE, JWT_SECRET } = require("../config/jwtconfig");
const AdminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "please add an email"],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please add a valid email",
    ],
  },
  password: {
    type: String,
    required: [true, "Please Add a password"],
    minLength: 6,
    select: false,
  },
  resetPasswordToken: String,
  resetPasswordExpired: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
//Encrypting our password before saving it into db.
AdminSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  // this.email = await bcrypt.hash(this.email, salt);
  next();
});
//Sign JWT and return
AdminSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id, role: "admin" }, JWT_SECRET, {
    expiresIn: JWT_EXPIRE,
  });
};

//Match user enetered password to user entered password
AdminSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
//Match user enetered password to user entered password
// AdminSchema.methods.matchEmail = async function (enteredEmail) {
//   return await bcrypt.compare(enteredEmail, this.email);
// };

// Reverse populate with virtuals

module.exports = mongoose.model("Admin", AdminSchema);
