const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { JWT_EXPIRE, JWT_SECRET } = require("../config/jwtconfig");
const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "Please Add First Name"],
    },
    lastName: {
      type: String,
      required: [true, "Please Add Last Name"],
    },
    username: {
      type: String,
      required: [true, "Please Add a username"],
      unique: true,
    },
    email: {
      type: String,
      required: [true, "please add an email"],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please add a valid email",
      ],
    },
    profile: {
      type: String,
      default: null,
    },

    role: {
      type: String,
      default: "customer",
      enum: ["customer", "seller"],
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
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
//Encrypting our password before saving it into db.
UserSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  // this.email = await bcrypt.hash(this.email, salt);
  next();
});
//Sign JWT and return
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, JWT_SECRET, {
    expiresIn: JWT_EXPIRE,
  });
};

//Match user enetered password to user entered password
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
//Match user enetered password to user entered password
// UserSchema.methods.matchEmail = async function (enteredEmail) {
//   return await bcrypt.compare(enteredEmail, this.email);
// };

// Reverse populate with virtuals
UserSchema.virtual("chats", {
  ref: "Chat",
  localField: "_id",
  foreignField: "reciever",
  justOne: false,
});

UserSchema.virtual("posts", {
  ref: "Post",
  localField: "_id",
  foreignField: "reciever",
  justOne: false,
});
module.exports = mongoose.model("User", UserSchema);
