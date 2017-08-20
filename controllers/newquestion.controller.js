var newQuestion = require("../models/newquestion");
var mongoose = require("mongoose");

exports.add = function(req, res, next) {
  //console.log(req.question + "<---this");
  res.render("newquestion", {
    title: "Enter a new Quesiton",
    //errors: "",
    buttonText: "Add Question",
    item: {
      question: "",
      answer: "",
      author: ""
    }
  });
};

// this is to handle the post
exports.postNewQuestion = function(req, res, next) {
  // check all fields that need to be filled in
  req.checkBody("question", "Please enter a question").notEmpty();
  console.log(req.body.question);
  req.sanitize("question").checkCasing(); //.checkCasing();
  console.log(req.body.question);
  req.sanitize("question").escape();
  req.sanitize("question").trim();
  req.checkBody("answer", "Please enter your answer").notEmpty();
  req.sanitize("answer").escape();
  req.sanitize("answer").trim();
  req.checkBody("author", "Please enter author name").notEmpty();
  req.sanitize("author").escape();
  req.sanitize("author").trim();

  var errs = req.validationErrors();
  console.log(errs);
  var data = new newQuestion({
    //_id: mongoose.Types.ObjectId(),
    question: req.body.question,
    answer: req.body.answer,
    author: req.body.author //,
    //created: Date.now(), -- there is some built in stuffs
    //updated: Date.now()
  });

  // validation errors
  if (errs) {
    console.log(data + "<---this");
    res.render("newquestion", {
      title: "Enter a new Quesiton",
      errors: errs,
      buttonText: "Add Question",
      item: {
        question: req.body.question,
        answer: req.body.answer,
        author: req.body.author
      }
    });
  } else {
    data.save(function(err, payload) {
      if (err) return next(err);

      // success
      res.redirect("/");
      //res.send("You successfully added a question!");
    });
  }
};
