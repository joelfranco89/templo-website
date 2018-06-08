var express = require("express"),
    app = express(),
    User = require("../models/user_schema.js")

//Route to user profile
app.get("/profile/:id", function(req, res){
  req.flash("success", "User profile is currently under construction");
  res.redirect("back");
  
  // User.findById(req.params.id, function(err, user){
  //   if (err){
  //     res.send("User could not be located");
  //   }else if (typeof req.user != "undefined" && user.profile.isHidden && req.user.id == req.params.id){
  //     res.render("userprofile.ejs", {user: user});
  //   }else if (typeof req.user != "undefined" && user.profile.isHidden){
  //     req.flash("success", "User has hidden their profile")
  //     res.redirect("back");
  //   }else if (typeof req.user == "undefined" && user.profile.isHidden){
  //     req.flash("success", "User has hidden their profile")
  //     res.redirect("back");
  //   }else{
  //     res.render("userprofile.ejs", {user: user})
  //   }
  // });
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

//Hide profile 
app.post("/hideprofile/:id", function(req, res){
  User.findById(req.params.id, function(err, user){
    if (err){
      res.send(err);
    }else{
      user.profile.isHidden = true;
      user.save();
      req.flash("success", "Your profile has been hidden from the public")
      res.redirect("/profile/" + req.params.id)
    }
  })
});

//UnHide profile 
app.post("/unhideprofile/:id", function(req, res){
  User.findById(req.params.id, function(err, user){
    if (err){
      res.send(err);
    }else{
      user.profile.isHidden = false;
      user.save();
      req.flash("success", "Your profile is now public")
      res.redirect("/profile/" + req.params.id);
    }
  })
});

module.exports = app;