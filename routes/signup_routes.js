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
    res.send("username cannot contain any spaces");
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

module.exports = app