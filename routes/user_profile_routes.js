var express = require("express"),
    app = express(),
    User = require("../models/user_schema.js")

//Route to user profile
app.get("/profile/:id", function(req, res){
  User.findById(req.params.id, function(err, user){
    if (err){
      res.send("User could not be located");
    }else{
      res.render("userprofile.ejs", {user: user})
    }
  });
});

//Route to change email
app.post("/changeemail/:id", function(req, res){
    User.findById(req.params.id, function(err, user){
      if (err){
        req.flash("success", err);
        res.redirect("/profile/" + req.params.id);
      }else{
        user.email = req.body.email.toLowerCase();
        user.save();
        req.flash("success", "Your email has been successfully changed to " + req.body.email.toLowerCase());
        res.redirect("/profile/" + req.params.id);
      }
    });
});

module.exports = app;