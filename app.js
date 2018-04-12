var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    methodOverride = require("method-override"),
    moment = require('moment'),
    Question = require("./models/question_schema.js"),
    passport = require("passport"),
    localStrategy = require("passport-local"),
    flash = require("connect-flash"),
    User = require("./models/user_schema.js"),
    Answer = require("./models/answer_schema.js"),
    MotivationalQuote = require("./models/motivational_quotes.js")

var homeRoutes = require("./routes/home_routes.js"),
    headerRoutes = require("./routes/header_routes.js"),
    loginRoutes = require("./routes/login_routes.js"),
    signupRoutes = require("./routes/signup_routes.js"),
    questionPageRoutes = require("./routes/question_page_routes.js"),
    userProfileRoutes = require("./routes/user_profile_routes.js"),
    forgotPasswordRoute = require("./routes/password_reset_route.js"),
    adminRoutes = require("./routes/admin_routes.js")
    


// Connect application to a mongoDB database
//mongoose.connect("mongodb://localhost/medicalProject");
mongoose.connect("mongodb://joelfranco:Player73189!@ds131329.mlab.com:31329/templo");

// set express to use body-parser to parse objects
app.use(bodyParser.urlencoded({extended: true}));

//serve front end files 
app.use(express.static(__dirname + '/public'));

//overrides the POST request into a PUT request
app.use(methodOverride("_method"));

//Flash messages for err messages
app.use(flash());

//===================================
// Passport configuration
app.use(require("express-session")({
  secret: "Test",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//====================================

// This passes in current user data on ALL routes
app.use(function(req, res, next){
  //This will check if an error has occured. 
  res.locals.message = req.flash("error");
  res.locals.message = req.flash("success");
  // currentUser is the user object name that will be called on all views
  res.locals.currentUser = req.user;
  //This allows the following code to run. If not called, the route will stop
  next();
});

// Routes
app.use(homeRoutes);
app.use(headerRoutes);
app.use(loginRoutes);
app.use(signupRoutes);
app.use(questionPageRoutes);
app.use(userProfileRoutes);
app.use(forgotPasswordRoute);
app.use(adminRoutes);      



//Checking if user is logged in
function isLoggedIn(req, res, next){
  if (req.isAuthenticated()){
    next();
  }else{
    res.redirect("/login");
  }
}

const host = '0.0.0.0';
const port = process.env.PORT || 3000;

app.listen(port, host, function() {
  console.log("Server started.......");
});