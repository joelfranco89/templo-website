var express = require("express"),
    app = express(),
    passport = require("passport"),
    User = require("../models/user_schema.js"),
    Question = require("../models/question_schema.js"),
    moment = require('moment'),
    flash = require("connect-flash")
    
function getRequest(path, fileName){
  app.get(path, function(req, res){
    res.render(fileName);
  });
}
// Signup page route
getRequest("/signup", "signup.ejs")
// Login page route
getRequest("/login", "login.ejs")
//Route to new question
getRequest("/newquestion", "newquestion.ejs")
//Route to new search
getRequest("/questionsearch", "questionsearch.ejs")
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

    if (req.body.question.length < 20){
      req.flash("success", "Question needs to be longer than 20 characters");
      res.redirect("back")
    }else{
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
    }
});

//New search route
app.post("/questionsearch", function(req, res){
  var newSearch = req.body.searchInput
  Question.find(function(err, questions){
    if (err){
      res.send(err);
    }else{
      res.render("questionsearch.ejs", {questions: questions, search: newSearch});       
    }
  });
});




module.exports = app;