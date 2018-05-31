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
      res.render("kneePain.ejs", {kneePainResults: kneePainResults})
  });
});

app.get("/categories/depressionandanxiety", function(req, res){
  Question.find(function(err, questions){

    //Array with duplicates
    var results = []
  
    var depressionAndAnxietyResults = []
  
      questions.forEach(function(question){
        for (var i = 0; i < categories.depressionAndAnxiety.length; i++){
          if (question.question.toLowerCase().includes(categories.depressionAndAnxiety[i].toLowerCase())){
            results.unshift(question);
            }
          }
        })
  
  
        for (var i = 0; i < results.length; i++){
          if (depressionAndAnxietyResults.indexOf(results[i] == -1)){
            depressionAndAnxietyResults.push(results[i]);
          }
        }
        res.render("depressionAndAnxiety.ejs", {depressionAndAnxietyResults: depressionAndAnxietyResults})
    }); 
});

app.get("/categories/shoulderpain", function(req, res){
  Question.find(function(err, questions){

    //Array with duplicates
    var results = []
  
    var shoulderPainResults = []
  
      questions.forEach(function(question){
        for (var i = 0; i < categories.shoulderPain.length; i++){
          if (question.question.toLowerCase().includes(categories.shoulderPain[i].toLowerCase())){
            results.unshift(question);
            }
          }
        })
  
  
        for (var i = 0; i < results.length; i++){
          if (shoulderPainResults.indexOf(results[i] == -1)){
            shoulderPainResults.push(results[i]);
          }
        }
        res.render("shoulderPain.ejs", {shoulderPainResults: shoulderPainResults})
    }); 
});

app.get("/categories/backpain", function(req, res){
  Question.find(function(err, questions){

    //Array with duplicates
    var results = []
  
    var backPainResults = []
  
      questions.forEach(function(question){
        for (var i = 0; i < categories.backPain.length; i++){
          if (question.question.toLowerCase().includes(categories.backPain[i].toLowerCase())){
            results.unshift(question);
            }
          }
        })
  
  
        for (var i = 0; i < results.length; i++){
          if (backPainResults.indexOf(results[i] == -1)){
            backPainResults.push(results[i]);
          }
        }
        res.render("backPain.ejs", {backPainResults: backPainResults})
    }); 
});

app.get("/categories/chestpain", function(req, res){
  Question.find(function(err, questions){

    //Array with duplicates
    var results = []
  
    var chestPainResults = []
  
      questions.forEach(function(question){
        for (var i = 0; i < categories.chestPain.length; i++){
          if (question.question.toLowerCase().includes(categories.chestPain[i].toLowerCase())){
            results.unshift(question);
            }
          }
        })
  
  
        for (var i = 0; i < results.length; i++){
          if (chestPainResults.indexOf(results[i] == -1)){
            chestPainResults.push(results[i]);
          }
        }
        res.render("chestPain.ejs", {chestPainResults: chestPainResults})
    }); 
});

app.get("/categories/stomachpain", function(req, res){
  Question.find(function(err, questions){

    //Array with duplicates
    var results = []
  
    var stomachPainResults = []
  
      questions.forEach(function(question){
        for (var i = 0; i < categories.stomachPain.length; i++){
          if (question.question.toLowerCase().includes(categories.stomachPain[i].toLowerCase())){
            results.unshift(question);
            }
          }
        })
  
  
        for (var i = 0; i < results.length; i++){
          if (stomachPainResults.indexOf(results[i] == -1)){
            stomachPainResults.push(results[i]);
          }
        }
        res.render("stomachPain.ejs", {stomachPainResults: stomachPainResults})
    }); 
});


module.exports = app;