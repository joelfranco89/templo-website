var express = require("express"),
    app = express(),
    passport = require("passport"),
    User = require("../models/user_schema.js"),
    Question = require("../models/question_schema.js"),
    Answer = require("../models/answer_schema.js"),
    MotivationalQuotes = require("../models/motivational_quotes.js")

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

    //Route to admin motivational quotes page
    app.get("/admin/motivationalquotes", function(req, res){
        MotivationalQuotes.find(function(err, quotes){
            res.render("adminMotivationalQuotesPage.ejs", {quotes: quotes});
        })
    })

    //Route to admin post motivational quote
    app.post("/admin/motivationalquotes", function(req, res){
        var quote = {
            quote: req.body.quote,
            author: req.body.author
        }
        MotivationalQuotes.create(quote, function(err, quote){
            MotivationalQuotes.find(function(err, quotescount){
                quote.count = quotescount.length;
                quote.save()
            });
            res.redirect("/admin/motivationalquotes")
        });


        
    });

    module.exports = app;

