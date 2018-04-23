var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  email: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  questions: [],
  answers: [],
  followedQuestions: [],
  isAdmin: Boolean,
  profile: {
    isHidden: Boolean
  },
  isActive: Boolean,
  validationHash: Number
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);