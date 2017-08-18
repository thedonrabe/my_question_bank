var express = require("express");
var router = express.Router();
var user = require("../models/user");
var bcrypt = require("bcrypt");
var signupController = require("../controllers/signup.controller");

router.get("/", signupController.getSignUp);

router.post("/", signupController.createUserObj);

module.exports = router;
