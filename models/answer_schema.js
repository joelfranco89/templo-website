var mongoose = require("mongoose")

// Creating mongoose answer object structure for db and model
var answerSchema = new mongoose.Schema({
  answer: String,
  authorId: String,
  questionId: String,
  questionText: String,
  offensive: Boolean
});



module.exports = mongoose.model("Answer", answerSchema);
