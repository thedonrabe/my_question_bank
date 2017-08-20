var express = require("express");
var router = express.Router();

var questionListController = require("../controllers/questionlist.controller");
/* GET home page. */
router.get("/", questionListController.getQuestionList);

router.post("/", questionListController.getQuestion);

module.exports = router;
