var mongoose = require("mongoose")

// Creating mongoose question object structure for db and model
var questionSchema = new mongoose.Schema({
  question: String,
  authorId: String,
  authorUsername: String,
  helpful: Number,
  notHelpful: Number,
  views: Number,
  dateCreated: String,
  timeCreated: String,
  answers: [],
  userEmailsArray: []
});



module.exports = mongoose.model("Question", questionSchema);
