var Question = require("../models/question_schema.js"),
    express = require("express"),
    app = express(),
    flash = require("connect-flash"),
    MotivationalQuote = require("../models/motivational_quotes.js")
    



//Route to main page
app.get("/", function(req, res){


  var quotesArray = []

  MotivationalQuote.find(function(err, quote){
    quote.forEach(function(quote){
      quotesArray.unshift(quote);
    });
  });

  Question.find(function(err, questions){
    if (err){
      res.send(err);
    }else{
      res.render("home.ejs", {questions: questions, quotesArray: quotesArray}); 
    }
  });
});

module.exports = app;