var express = require("express"),
    app = express(),
    Question = require("../models/question_schema.js"),
    Answer = require("../models/answer_schema.js"),
    User = require("../models/user_schema.js"),
    nodemailer = require("nodemailer")

//Route to question page
app.get("/question/:id", function(req, res){
  Question.findById(req.params.id, function(err, question){
    if (!question){
      req.flash("success", "Question has been deleted by the author or an administrator")
      res.redirect("back");
    }else if (err){  
      res.send(err);
    }else{
      question.save(question.views += 1);   
      res.render("questionPage.ejs", {question: question});
    }
  }); 
});

//Delete question route
app.delete('/deletequestion/:id', function(req, res){
  Question.findByIdAndRemove(req.params.id, function(err){
    for (i = 0; i < req.user.questions.length; i++){
      if (req.user.questions[i]._id == req.params.id){
        req.user.save(req.user.questions.splice(i, 1));
      }
    }
    
    res.redirect("/");
  });
});

//Admin delete question route
app.delete('/admindeletequestion/:id', function(req, res){
  Question.findByIdAndRemove(req.params.id, function(err){
    res.redirect("/");
  });
});

//Delete answer route
app.delete('/deleteanswer/:id/question/:question_id', function(req, res){
  Answer.findByIdAndRemove(req.params.id, function(err){
    for (i = 0; i < req.user.answers.length; i++){
      if (req.user.answers[i]._id == req.params.id){
        req.user.save(req.user.answers.splice(i, 1));
      }
    }
  });
  Question.findById(req.params.question_id, function(err, question){
    for (var i = 0; i < question.answers.length; i++){
      if (question.answers[i]._id == req.params.id){
        question.answers.splice(i, 1);
        question.save();
      }
    }
  });  
  res.redirect("/question/" + req.params.question_id);
});

//Admin delete answer route
app.delete('/admindeleteanswer/:id/question/:question_id', function(req, res){
  Answer.findByIdAndRemove(req.params.id, function(err){
    
  });
  Question.findById(req.params.question_id, function(err, question){
    for (i = 0; question.answers.length; i++){
      if (question.answers[i]._id == req.params.id){
        question.save(question.answers.splice(i, 1));
      }
    }
 });  
 Question.findById(req.params.question_id, function(err, question){
  for (var i = 0; i < question.answers.length; i++){
    if (question.answers[i]._id == req.params.id){
      question.answers.splice(i, 1);
      question.save();
    }
  }
});  
 res.redirect("/question/" + req.params.question_id);
});



//Route to post new answer to question
app.post("/question/:id/answer", function(req, res){
  var newAnswer = {
                     answer: req.body.answer, 
                     questionId: req.params.id,
                     offensive: false,
                     dateCreated: Date.now()
                  }
  Question.findById(req.params.id, function(err, question){
    if (err){
      res.send(err);
    }else{
      if (req.body.answer.length < 11){
        req.flash("success", "Answer needs to be longer than 10 characters");
        res.redirect("back");
      }else{
        Answer.create(newAnswer, function(err, newAnswer){
          if (err){
            res.send(err);
          }else{
              if (req.user){
                newAnswer.save(newAnswer.questionText = question.question);
                newAnswer.save(newAnswer.authorId = req.user._id);
                req.user.save(req.user.answers.unshift(newAnswer));
              }
              question.save(question.answers.unshift(newAnswer));
              res.redirect("/question/" + req.params.id);
          }
        });
      }
    }
    //Alert followed emails on new answer
    question.userEmailsArray.forEach(function(email){
      var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'joelfranco@templousa.com',
          pass: process.env.EMAILPASSWORD
        }
      });
      
      var mailOptions = {
        from: 'support@templousa.com',
        to: email,
        subject: 'Message from the Templo team',
        text: 'There is a new answer on the below question that you are following: \n\n' +
              question.question + '\n\n' +
              'Click the below link to check it out! \n\n' +
              'http://' + req.headers.host + '/question/' + question._id + '\n\n' + 
              'To unfollow, click the link below \n\n' +
              'http://' + req.headers.host + '/question/' + 'unfollow/' + email + question._id
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
    });
  }); 
});

//Unfollow Question
app.get('/question/unfollow/:email/:id', function(req, res){
  Question.findById(req.params.id, function(err, question){
    for (var i = 0; i < question.userEmailsArray.length; i++){
      if (question.userEmailsArray[i].toLowerCase() === req.params.email.toLowerCase()){
        question.userEmailsArray.splice(i, 1);
        question.save();
      }
    }
  });
})

//Helpful Route

app.post("/helpful/:id", function(req, res){
  Question.findById(req.params.id, function(err, question){
    if (err){
      res.send(err);
    }else{
      question.save(question.usersMarkedHelpful.unshift(req.user.username))
      question.save(question.helpful += 1);
      question.save(question.views -= 1);
      res.redirect("/question/" + req.params.id);

    }
  });
});

//Unmark Helpful Route

app.post("/unmarkhelpful/:id", function(req, res){
  Question.findById(req.params.id, function(err, question){
    if (err){
      res.send(err);
    }else{
      for (var i = 0; i < question.usersMarkedHelpful.length; i++){
        if (req.user.username == question.usersMarkedHelpful[i]){
          question.save(question.usersMarkedHelpful.splice(i, 1))
        }
      }
      question.save(question.helpful -= 1);
      question.save(question.views -= 1);
      res.redirect("/question/" + req.params.id);

    }
  });
});

// Non-helpful Route

app.post("/nothelpful/:id", function(req, res){
  Question.findById(req.params.id, function(err, question){
    if (err){
      res.send(err);
    }else{
      question.save(question.usersMarkedUnhelpful.unshift(req.user.username))
      question.save(question.notHelpful += 1);
      question.save(question.views -= 1);
      res.redirect("/question/" + req.params.id);
      
    }
  });
});

// Unmark Non-helpful Route

app.post("/unmarknothelpful/:id", function(req, res){
  Question.findById(req.params.id, function(err, question){
    if (err){
      res.send(err);
    }else{
      for (var i = 0; i < question.usersMarkedUnhelpful.length; i++){
        if (req.user.username == question.usersMarkedUnhelpful[i]){
          question.save(question.usersMarkedUnhelpful.splice(i, 1))
        }
      }
          question.save(question.notHelpful -= 1);
          question.save(question.views -= 1);
          res.redirect("/question/" + req.params.id);     
    }
  });
});


//Follow Question Route
app.post("/followquestion/:id", function(req, res){
  Question.findById(req.params.id, function(err, question){

    var duplicateEmail = 0

    question.userEmailsArray.forEach(function(email){
      if (email.toLowerCase() === req.body.email.toLowerCase()){
        duplicateEmail += 1
      }
    });
    if (duplicateEmail > 0){
      req.flash('success', req.body.email + ' ' + 'is already following this question');
      res.redirect("/question/" + req.params.id);
    }else{
      if (err){
        res.send(err);
        
      }else{
        req.flash('success', 'You are now following this question. When a new answer is posted, you will be alerted at ' + req.body.email)
        question.userEmailsArray.unshift(req.body.email);
        question.save();
        res.redirect("/question/" + req.params.id);
      }
    }
  });
});

//Unfollow Question Route
app.post("/unfollowquestion/:id", function(req, res){
  Question.findById(req.params.id, function(err, question){
    if (err){
      res.send(err);
    }else{
      req.flash("success", "You are no longer following this question");
      for (var i = 0; i < question.userEmailsArray.length; i++){
        if (question.userEmailsArray[0] == req.user.email){
          question.userEmailsArray.splice(i, 1);
        }
      }
      for (var i = 0; i < req.user.followedQuestions.length; i++){
        if (req.params.id == req.user.followedQuestions[i]._id){
          req.user.followedQuestions.splice(i, 1);
        }
      }
      req.user.save();
      question.save();
      res.redirect('/question/' + req.params.id);
    }
  });
});



module.exports = app;