var express = require("express"),
    app = express(),
    passport = require("passport"),
    flash = require("connect-flash")


// Logging in route - passport.authenticate authenticates the user and logs them in
app.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true
}), function(req, res){
    
});

module.exports = app;