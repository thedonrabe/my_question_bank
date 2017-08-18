var express = require("express");
var router = express.Router();

var questionListController = require("../controllers/questionlist.controller");
/* GET home page. */
router.get("/", questionListController.getQuestionList);

// , function(req, res, next) {
//   res.render('index', { title: 'Question Bank', items:  });
// });

router.post("/", questionListController.getQuestion);

//router.set("/", questionListController.getToken);

module.exports = router;
