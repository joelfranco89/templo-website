var express = require("express"),
    app = express(),
    passport = require("passport"),
    flash = require("connect-flash"),
    User = require("../models/user_schema.js"),
    crypto = require("crypto"),
    async = require("async"),
    nodemailer = require('nodemailer')


    app.get("/forgotpassword", function(req, res){
        res.render("forgotPasswordPage.ejs");
    });

    //Sets token, send password reset email
    app.post('/forgotpassword', function(req, res, next) {
        async.waterfall([
          function(done) {
            crypto.randomBytes(20, function(err, buf) {
              var token = buf.toString('hex');
              done(err, token);
            });
          },
          function(token, done) {
            User.findOne({ email: req.body.email.toLowerCase() }, function(err, user) {
              if (!user) {
                req.flash('success', 'No account with that email address exists.');
                return res.redirect('/forgotpassword');
              }
      
              user.resetPasswordToken = token;
              user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
      
              user.save(function(err) {
                done(err, token, user);
              });
            });
          },
          function(token, user, done) {
            var smtpTransport = nodemailer.createTransport({
              service: 'Gmail', 
              auth: {
                user: 'joelfranco@templousa.com',
                pass: process.env.EMAILPASSWORD
              }
            });
            var mailOptions = {
              to: user.email,
              from: 'support@templousa.com',
              subject: 'Templo Password Reset',
              text: 'You are receiving this because you (or someone else) has requested the reset of the password for your account.\n\n' +
                'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                'http://' + req.headers.host + '/reset/' + token + '\n\n' +
                'If you did not request this, please ignore this email and your password will remain unchanged.\n'
            };
            smtpTransport.sendMail(mailOptions, function(err) {
              console.log('mail sent');
              req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions. \n\n' + 
                                  'If you do not receive an email within 5 minutes, please try again.');
              done(err, 'done');
            });
          }
        ], function(err) {
          if (err) return next(err);
          res.redirect('/forgotpassword');
        });
      });
      
      //Link to reset password
      app.get('/reset/:token', function(req, res) {
        User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
          if (!user) {
            req.flash('success', 'Password reset token is invalid or has expired.');
            return res.redirect('/forgot');
          }
          res.render('resetPasswordPage.ejs', {token: req.params.token});
        });
      });

      //New password is created, clears token, sends success email
      app.post('/reset/:token', function(req, res) {
        async.waterfall([
          function(done) {
            User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
              if (!user) {
                req.flash('success', 'Password reset token is invalid or has expired.');
                return res.redirect('back');
              }
              if(req.body.password === req.body.confirmpassword) {
                user.setPassword(req.body.password, function(err) {
                  user.resetPasswordToken = undefined;
                  user.resetPasswordExpires = undefined;
      
                  user.save(function(err) {
                    req.logIn(user, function(err) {
                      done(err, user);
                    });
                  });
                })
              } else {
                  req.flash("success", "Passwords do not match.");
                  return res.redirect('back');
              }
            });
          },
          function(user, done) {
            var smtpTransport = nodemailer.createTransport({
              service: 'Gmail', 
              auth: {
                user: 'joelfranco@templousa.com',
                pass: process.env.EMAILPASSWORD
              }
            });
            var mailOptions = {
              to: user.email,
              from: 'support@templousa.com',
              subject: 'Your password has been changed',
              text: 'Hello,\n\n' +
                'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
            };
            smtpTransport.sendMail(mailOptions, function(err) {
              req.flash('success', 'Success! Your password has been changed.');
              done(err);
            });
          }
        ], function(err) {
          res.redirect('/');
        });
      });



    module.exports = app;