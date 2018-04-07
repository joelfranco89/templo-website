var express = require("express"),
    app = express(),
    passport = require("passport"),
    User = require("../models/user_schema.js"),
    Question = require("../models/question_schema.js"),
    Answer = require("../models/answer_schema.js")

    app.get("/admin/question", function(req, res){
        Question.find(function(err, question){
            res.render("adminPage.ejs", {question: question});
        });
    });

    module.exports = app;