var express = require("express"),
    app = express(),
    passport = require("passport"),
    User = require("../models/user_schema.js"),
    Question = require("../models/question_schema.js"),
    moment = require('moment'),
    flash = require("connect-flash")
    


// Signup page route
app.get("/signup", function(req, res){
  res.render("signup.ejs");      
});

// Login page route
app.get("/login", function(req, res){
  res.render("login.ejs");      
});

//Route to new question
app.get("/newquestion", function(req, res){
  res.render("newquestion.ejs");
});

//Route to new search
app.get("/questionsearch", function(req, res){
  res.render("questionsearch.ejs");
});

//Log out route
app.get("/logout", function(req, res){
  req.logout();
  res.redirect("/");
});



// Posting new question
app.post("/newquestion", function(req, res){
  var newQuestion = {
                      question: req.body.question,
                      helpful: 0,
                      notHelpful: 0,
                      views: 0,
                      dateCreated: moment().format('MMM Do YYYY'),
                      timeCreated: moment().format('LT'),
                    }

    Question.create(newQuestion, function(err, newQuestion){
      if (err){
        res.send(err);
      }else{
        if (!req.user){
          newQuestion.save(newQuestion.authorId = "Guest")
        }else{
          req.user.save(req.user.questions.unshift(newQuestion));
          newQuestion.save(newQuestion.authorId = req.user._id);
          newQuestion.save(newQuestion.authorUsername = req.user.username);
        }
        res.redirect("/question/" + newQuestion._id);
      }
    });
});

//New search route
app.post("/questionsearch", function(req, res){
  var newSearch = req.body.searchInput
  Question.find(req.params.id, function(err, questions){
    if (err){
      res.send(err);
    }else{
      res.render("questionsearch.ejs", {questions: questions, search: newSearch});       
    }
  });
});




module.exports = app;