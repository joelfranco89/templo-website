var express = require("express"),
    app = express(),
    passport = require("passport"),
    User = require("../models/user_schema.js"),
    Question = require("../models/question_schema.js"),
    Answer = require("../models/answer_schema.js"),
    MotivationalQuotes = require("../models/motivational_quotes.js")

    // Route to admin question page
    app.get("/admin/questions", function(req, res){
        if (typeof req.user == "undefined" || req.user && req.user.username != "admin"){
            res.send("You do not have access to this page");
        }else{
            Question.find(function(err, questions){
                if (err){
                    res.send(err);
                }else{
                    res.render("adminQuestionPage.ejs", {questions: questions});
                } 
            });
        }

    });

    //Route to admin answer page
    app.get("/admin/answers", function(req, res){
        if (typeof req.user == "undefined" || req.user && req.user.username != "admin"){
            res.send("You do not have access to this page");
        }else{
        Answer.find(function(err, answers){
            res.render("adminAnswerPage.ejs", {answers: answers});
        });
        }
    });

    //Route to admin motivational quotes page
    app.get("/admin/motivationalquotes", function(req, res){
        if (typeof req.user == "undefined" || req.user && req.user.username != "admin"){
            res.send("You do not have access to this page");
        }else{
        MotivationalQuotes.find(function(err, quotes){
            res.render("adminMotivationalQuotesPage.ejs", {quotes: quotes});
        });
        }
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

    //Route to delete motivational quote
    app.delete("/admin/deletequote/:id", function(req,res){
        if (typeof req.user == "undefined" || req.user && req.user.username != "admin"){
            res.send("You do not have access to this page");
        }else{
        MotivationalQuotes.findByIdAndRemove(req.params.id, function(err){
            if (err){
                res.send(err);
            }else{
                res.redirect("/admin/motivationalquotes");
            }
        });
        }
    });

    module.exports = app;

