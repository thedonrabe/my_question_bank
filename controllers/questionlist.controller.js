var questions = require("../models/newquestion");
var express = require("express");
var router = express.Router();
var updateQuestionController = require("../controllers/updatequestion.controller");
var newQuestionController = require("../controllers/newquestion.controller");
var jwt = require("jsonwebtoken");

// exports.getToken = function(req, res, next) {
//   var token =
//     req.headers.authorization &&
//     req.headers.authorization &&
//     req.headers.authorization.split(" ")[0];
//   //req.body.token || req.query.token || req.headers["x-access-token"];
//   console.log("*****> " + token);
//   if (token === "JWT") {
//     jwt.verify(token, app.get("secret"), function(err, info) {
//       if (err) {
//         return res.json({
//           success: false,
//           message: "Failed to authenticate token."
//         });
//       } else {
//         console.log(info);
//         req.info = info;
//         loggedInText = req.info
//           ? req.info.username + " logged in"
//           : "not logged in";
//         next();
//       }
//     });
//   }
// };

exports.getQuestionList = function(req, res, next) {
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
      } //else {
      //console.log(results);

      //}

      //console.log(req.info);
      if (res.app.get("token")) {
        jwt.verify(res.app.get("token"), res.app.get("secret"), function(
          err,
          decode
        ) {
          if (err) req.user = undefined;
          console.log(decode);
          console.log("SUCCESSSSS!!");
          //req.user = decode;
          console.log(decode._doc.username);

          var loggedInText = decode._doc.username
            ? decode._doc.username + req.user.username + " logged in"
            : "not logged in";

          res.render("index1", {
            title: "Question List",
            items: results,
            buttonText: "Add New Quesition",
            loggedIn: loggedInText
          });
          //next();
        });
      }
    }
  );
};

exports.getQuestion = function(req, res, next) {
  //console.log(req.body.edit);
  var str = "";
  if (req.body.addNew) str = "newquestion/";
  else str = "updatequestion/" + req.body.edit;

  res.redirect(str);
  // if (req.body.addNew) {
  //   //res.render("newquestion", { buttonText: "Add New Question" });
  //   //router.get("/", newQuestionController.add(req, res, next));
  // } else {
  //   questions.findOne({ _id: req.body.edit }, function(err, results) {
  //     //res.locals.objectToPass = results;

  //     console.log(results);
  //   });
  //router.get("/", updateQuestionController.getQuestionDetail(req, res, next));
  //     questions.findOne({ _id: req.body.edit }, function(err, results) {
  //       console.log(results);
  //       res.render("newquestion", {
  //         question: results.question,
  //         answer: results.answer,
  //         author: results.author,
  //         buttonText: "Update"
  //       });
  //     });
  //}
  //console.log(req.body.name);
  //console.log(req.params);
};
