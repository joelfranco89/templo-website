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

module.exports = app;