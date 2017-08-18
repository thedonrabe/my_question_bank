var mongoose = require("mongoose");
var questions = require("../models/newquestion");

exports.getQuestionDetail = function(req, res, next) {
  //console.log(req.body.edit);
  console.log(req.params._id);
  questions.findOne({ _id: req.params._id }, function(err, results) {
    console.log(results);
    res.render("updatequestion", {
      title: "Question Update Page",
      item: results,
      buttonText: "Update"
    });
  });
  //console.log(objectToPass);
  // res.render("newquestion", {
  //   question: res.locals.objectToPass.question,
  //   answer: res.locals.objectToPass.answer,
  //   author: res.locals.objectToPass.author,
  //   buttonText: "Update"
  // });
}; //);

exports.updateQuestion = function(req, res, next) {
  console.log(req.params);
  console.log(req.body);
  questions.findOne({ _id: req.params._id }, function(err, results) {
    if (err) throw err;
    results.question = req.body.question;
    results.answer = req.body.answer;
    results.author = req.body.author;
    results.updatedAt = Date().now;

    console.log(results);
    results.save(function(err, payload) {
      if (err) return next(err);

      // success
      res.redirect("/");
      //res.send("You successfully added a question!");
    });

    console.log("1 document updated");
  });
};
//};
//console.log(req.body.name);
//console.log(req.params);
//};
