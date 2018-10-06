var express = require("express"),
    app = express(),
    flash = require("connect-flash"),
    nodemailer = require('nodemailer')


app.get("/contactpage", function(req, res){
    res.render("contactPage.ejs");
}); 

app.post("/contact", function(req, res){
    var smtpTransport = nodemailer.createTransport({
        service: 'Gmail', 
        auth: {
          user: 'joelfranco@templousa.com',
          pass: process.env.EMAILPASSWORD
        }
      });
      var mailOptions = {
        to: "joelfranco@templousa.com",
        from: req.body.email,
        subject: 'Message from ' + req.body.firstName + " " + req.body.lastName + " at the contact page",
        text: req.body.message + "\n\n" +
              "User email: " + req.body.email
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        console.log('mail sent');
        req.flash('success', 'An e-mail has been sent to our team. \n\n' + 
                            'Please allow 24-48 hours for a response.');
        res.redirect('http://' + req.headers.host + '/contactpage/')
      });
});

app.get("/aboutpage", function(req, res){
  var url = req.headers.host
  res.render("aboutPage.ejs", {url: url})
});

module.exports = app;