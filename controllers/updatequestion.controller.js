var mongoose = require("mongoose");
var questions = require("../models/newquestion");

exports.getQuestionDetail = function(req, res, next) {
  // find the question to be updated and gather the properties... then render those
  questions.findOne({ _id: req.params._id }, function(err, results) {
    //console.log(results);
    res.render("updatequestion", {
      title: "Question Update Page",
      item: results,
      buttonText: "Update"
    });
  });
};

exports.updateQuestion = function(req, res, next) {
  //console.log(req.params);
  //console.log(req.body);

  questions.findOne({ _id: req.params._id }, function(err, results) {
    if (err) throw err;

    // find quesiton in db and change to user entered data
    results.question = req.body.question;
    results.answer = req.body.answer;
    results.author = req.body.author;
    results.updatedAt = Date().now;

    // save the updated question to the database
    //console.log(results);
    results.save(function(err, payload) {
      if (err) return next(err);

      // success... redirect user back to question list
      res.redirect("/");
      //res.send("You successfully added a question!");
    });
    //console.log("1 document updated");
  });
};
