var express = require("express");
var router = express.Router();

var questionController = require("../controllers/newquestion.controller");

/* GET users listing. */
router.get("/", questionController.add);

router.post("/", questionController.postNewQuestion);

module.exports = router;
