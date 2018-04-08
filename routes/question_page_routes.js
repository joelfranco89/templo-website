var express = require("express"),
    app = express(),
    Question = require("../models/question_schema.js"),
    Answer = require("../models/answer_schema.js"),
    User = require("../models/user_schema.js"),
    nodemailer = require("nodemailer")

//Route to question page
app.get("/question/:id", function(req, res){
  Question.findById(req.params.id, function(err, question){
    if (err){
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
     for (i = 0; question.answers.length; i++){
       if (question.answers[i]._id == req.params.id){
         question.save(question.answers.splice(i, 1));
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
  res.redirect("/question/" + req.params.question_id);
});

//Edit answer route
app.get("/editanswer/:id/question/:question_id", function(req, res){
  var answerToEditId = {answer: req.params.id}
  Question.findById(req.params.question_id, function(err, question){
    if (err){
      res.send(err);
    }else{
      res.render("editAnswer.ejs", {question: question, answerToEditId: answerToEditId})
    }
  });
});


//Route to post answer to question
app.post("/question/:id/answer", function(req, res){
  var newAnswer = {
                     answer: req.body.answer, 
                     questionId: req.params.id,
                     offensive: false
                  }
  Question.findById(req.params.id, function(err, question){
    if (err){
      res.send(err);
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
    //Alert followed emails on new answer
    question.userEmailsArray.forEach(function(email){
      var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'francstudiosinc@gmail.com',
          pass: 'player73189'
        }
      });
      
      var mailOptions = {
        from: 'francstudiosinc@gmail.com',
        to: email,
        subject: 'Message from the Templo team',
        text: 'There is a new answer on the below question that you are following: \n\n' +
              question.question + '\n\n' +
              'Click the below link to check it out! \n\n' +
              'http://' + req.headers.host + '/question/' + question._id 
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

//Helpful Route

app.post("/helpful/:id", function(req, res){
  Question.findById(req.params.id, function(err, question){
    if (err){
      res.send(err);
    }else{
      question.save(question.helpful += 1);
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
      question.save(question.notHelpful += 1);
      question.save(question.views -= 1);
      res.redirect("/question/" + req.params.id);
      
    }
  });
});

//Follow Question Route
app.post("/followquestion/:id", function(req, res){
  Question.findById(req.params.id, function(err, question){
    if (err){
      res.send(err);
    }else{
    req.flash('success', 'You are now following this questions. When someone answers this question, you will be alerted at ' + req.user.email + '. If this is not your email, you can change it on your user profile.')
    question.userEmailsArray.unshift(req.user.email);
    question.save();
    res.redirect("/question/" + req.params.id);
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
      question.save();
      res.redirect('/question/' + req.params.id);
    }
  });
});

module.exports = app;