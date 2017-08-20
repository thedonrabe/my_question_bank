var questions = require("../models/newquestion");
var express = require("express");
var router = express.Router();
var updateQuestionController = require("../controllers/updatequestion.controller");
var newQuestionController = require("../controllers/newquestion.controller");
var jwt = require("jsonwebtoken");

exports.getQuestionList = function(req, res, next) {
  // get all questions in the db up to 24... based on the most recently updated
  questions.aggregate(
    [
      {
        $sort: {
          updatedAt: -1
        }
      },
      {
        $limit: 24
      }
    ],
    function(err, results) {
      if (err) {
        res.status(500).send(err);
      } else {
        // if a user is logged in, display that... if not display that
        var loggedInText = req.user
          ? req.user._doc.username + " logged in"
          : "not logged in";

        //console.log(loggedInText);

        res.render("index1", {
          title: "Question List",
          items: results,
          buttonText: "Add New Quesition",
          loggedIn: loggedInText
        });
      }
    }
  );
};

exports.getQuestion = function(req, res, next) {
  // depending on which button is pushed redirect user to the appropriate route
  var str = "";
  if (req.body.addNew) str = "newquestion/";
  else str = "updatequestion/" + req.body.edit;

  res.redirect(str);
};
