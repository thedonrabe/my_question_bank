var express = require("express");
var router = express.Router();

var questionController = require("../controllers/updatequestion.controller");

router.get("/:_id", questionController.getQuestionDetail);

router.post("/:_id", questionController.updateQuestion);

module.exports = router;
