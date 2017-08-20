var router = require("express").Router();
var user = require("../models/user");
var bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
var loginController = require("../controllers/login.controller");

router.get("/", loginController.getLogin);

router.post("/", loginController.registerUser);

module.exports = router;
