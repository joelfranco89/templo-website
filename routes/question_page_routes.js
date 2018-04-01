var express = require("express"),
    app = express(),
    Question = require("../models/question_schema.js"),
    Answer = require("../models/answer_schema.js"),
    User = require("../models/user_schema.js")

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

//Update answer route
app.put("/editanswer/:id/question/:question_id", function(req, res){
  var answerEdited = {
    answer: req.body.answer
  }
  
  
  Answer.findByIdAndUpdate(req.params.id, answerEdited, function(err, updatedAnswer){
    if (err){
      res.send(err);
    }else{   
      res.redirect("/question/" + req.params.question_id)
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

module.exports = app;