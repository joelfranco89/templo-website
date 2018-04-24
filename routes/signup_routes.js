var express = require("express"),
    app = express(),
    passport = require("passport"),
    localStrategy = require("passport-local"),
    flash = require("connect-flash"),
    User = require("../models/user_schema.js"),
    nodemailer = require("nodemailer")

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
            res.render("signup.ejs", {message: err.message})
          }else{
          user.save(user.email = req.body.email);
          user.save(user.isActive = false)
          user.save(user.validationHash = Math.floor(Math.random() * 100000) + 1)
          req.flash("success", "An email has been sent to " + req.body.email + " to verify your account")
          res.redirect("/signup")     

          //Verification email
          var transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
              user: 'joelfranco@templousa.com',
              pass: process.env.EMAILPASSWORD
            }
          });
          
          var mailOptions = {
            from: 'support@templousa.com',
            to: req.body.email,
            subject: 'Verify your Templo account',
            text: 'Welcome to Templo!\n\n' +
                  'We wish you a wonderful experience while exploring all Templo has to offer.\n\n' +
                  'Please verify your Templo account by clicking on the link below.\n\n' +
                  'http://' + req.headers.host + '/verify/' + user.validationHash               
          };
          
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });
          }

        }); 
      }
    });
  }
});

module.exports = app