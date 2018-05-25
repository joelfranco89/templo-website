var Question = require("../models/question_schema.js"),
    express = require("express"),
    app = express(),
    flash = require("connect-flash"),
    MotivationalQuote = require("../models/motivational_quotes.js"),
    categories = require("../categories/categories.js")
    



//Route to main page
app.get("/", function(req, res){



  Question.find(function(err, questions){
    if (err){
      res.send(err);
    }else{
      res.render("home.ejs", {questions: questions, categories: categories}); 
    }
  });
});

//Categories Routes
app.get("/categories/kneepain", function(req, res){




  Question.find(function(err, questions){

  //Array with duplicates
  var results = []

  var kneePainResults = []

    questions.forEach(function(question){
      for (var i = 0; i < categories.kneePain.length; i++){
        if (question.question.toLowerCase().includes(categories.kneePain[i].toLowerCase())){
          results.unshift(question);
          }
        }
      })


      for (var i = 0; i < results.length; i++){
        if (kneePainResults.indexOf(results[i] == -1)){
          kneePainResults.push(results[i]);
        }
      }
      res.render("kneepain.ejs", {kneePainResults: kneePainResults})
  });
});

module.exports = app;