var express = require("express"),
    app = express(),
    passport = require("passport"),
    flash = require("connect-flash"),
    User = require("../models/user_schema.js")



//Email verification route
app.get("/verify/:validationHash", function(req, res){
  User.findOne({validationHash: req.params.validationHash}, function(err, user){
    if (!user){
      req.flash("success", "An error has occurred. Please try again.")
      res.redirect("/login");
    }else{
      user.validationHash = "";
      user.isActive = true;
      user.save();
      req.flash("success", "Your account has been verified.")
      res.redirect("/login");
    }
  })
});

// Logging in route - passport.authenticate authenticates the user and logs them in
// app.post("/login", passport.authenticate("local", {
//   successRedirect: "/",
//   failureRedirect: "/login",
//   badRequestMessage: "Test",
//   failureFlash: true
// }));

app.post('/login',
  passport.authenticate('local', {failureRedirect: "/loginfailed"}),
  function(req, res) {
    if (!req.user.isActive){
      req.flash("success","Your account needs to be verified. Please check your email to verify your account");
      req.logout();
      res.redirect("back")
    }else{
      res.redirect("/");
    }
  });
  

  //Route to login page if user failed to login. I created this to allow flash messages and not interfere with regular login route
  app.get("/loginfailed", function(req, res){
    if (!req.user){
      req.flash("success", "Username or password is incorrect.");
      res.redirect("/login");
    }
  });

module.exports = app;