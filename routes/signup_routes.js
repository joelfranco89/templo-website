var express = require("express"),
    app = express(),
    passport = require("passport"),
    localStrategy = require("passport-local"),
    flash = require("connect-flash"),
    User = require("../models/user_schema.js")

// Posting new user 
app.post("/signup", function(req, res){  
  var newUser = new User({username: req.body.username});
  if (req.body.username.indexOf(' ') !== -1){
    req.flash("success", "Username cannot contain any spaces")
    res.redirect("/signup");
  }else{
    User.findOne({email: req.body.email.toLowerCase()}, function(err, duplicateEmail){
      if (duplicateEmail){
        req.flash("success", "An account with that email already exists")
        res.redirect("/signup");
      }else{
        User.register(newUser, req.body.password, function(err, user){
          if (err){
            console.log(err.message)
            return res.render("signup.ejs", {message: err.message})
          }
          passport.authenticate("local")(req, res, function(){
            res.redirect("/");
          });
          user.save(user.email = req.body.email);
        }); 
      }
    });
  }
});

module.exports = app