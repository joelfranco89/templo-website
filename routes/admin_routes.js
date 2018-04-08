var express = require("express"),
    app = express(),
    passport = require("passport"),
    User = require("../models/user_schema.js"),
    Question = require("../models/question_schema.js"),
    Answer = require("../models/answer_schema.js")

    // Route to admin question page
    app.get("/admin/questions", function(req, res){
        Question.find(function(err, questions){
            if (err){
                res.send(err);
            }else{
                res.render("adminQuestionPage.ejs", {questions: questions});
            } 
        });
    });

    //Route to admin answer page
    app.get("/admin/answers", function(req, res){
        Answer.find(function(err, answers){
            res.render("adminAnswerPage.ejs", {answers: answers});
        });
    });

    module.exports = app;

