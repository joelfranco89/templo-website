var Question = require("../models/question_schema.js"),
    express = require("express"),
    app = express()
    



//Route to main page
app.get("/", function(req, res){
  Question.find(function(err, questions){
    if (err){
      res.send(err);
    }else{
      res.render("home.ejs", {questions: questions}); 
    }
  });
});

module.exports = app;