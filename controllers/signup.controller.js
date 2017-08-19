var router = require("express").Router;
var user = require("../models/user");
var bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
var questions = require("../models/newquestion");
//var app = require("../app");

exports.getSignUp = function(req, res, next) {
  //console.log(req.question + "<---this");
  res.render("signup", {
    title: "Sign Up"
  });
};

exports.createUserObj = function(req, res, next) {
  // validation
  req.checkBody("firstName", "Please enter your first name").notEmpty();
  //console.log(req.body.question);
  //req.sanitize("question").checkCasing(); //.checkCasing();
  console.log("asdfklasdfkljsdlkj" + req.body.firstName);
  //req.sanitize("firstName").escape();
  req.sanitize("firstName").trim();
  req.checkBody("lastName", "Please enter your last name").notEmpty();
  req.sanitize("lastName").escape();
  req.sanitize("lastName").trim();
  req.checkBody("username", "Please enter a user name").notEmpty();
  //req.sanitize("username").escape();
  req.sanitize("username").trim();
  req.checkBody("password", "Please enter a password").notEmpty();
  //req.sanitize("password").escape();
  req.sanitize("password").trim();
  req.checkBody("email", "Please enter a valid email address").isEmail();
  //req.checkBody("email", "Please enter a valid email address").isEmail();
  //req.sanitize("email").escape();
  req.sanitize("email").trim();
  var errs = req.validationErrors();
  if (errs) {
    //console.log(data + "<---this");
    res.render("signup", {
      title: "Sign In",
      errors: errs,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      username: req.body.username,
      email: req.body.email
    });
    //return;
  } else {
    questions.aggregate(
      [
        {
          $match: {
            email: req.body.email,
            username: req.body.username
          }
        }
      ],
      function(err, data) {
        if (err) throw err;

        if (data.email == req.body.email) {
          res.json({
            success: false,
            message: "A User Has Already Been Created With This Email Address"
          });
        } else if (data.username == req.body.username) {
          res.json({
            success: false,
            message: "This username is taken"
          });
        } else {
          //if (!data) {
          // hash the password and send the new user into database
          bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(req.body.password, salt, function(err, hash) {
              var tempUser = new user({
                username: req.body.username,
                password: hash,
                email: req.body.email,
                firstName: req.body.firstName,
                lastName: req.body.lastName
              });
              console.log(hash);
              console.log(tempUser);
              tempUser.save(function(err, payload) {
                if (err) return next(err);
              });

              // create token
              var token = jwt.sign(tempUser, req.app.get("secret"), {
                expiresIn: 3600
              });

              res.app.set("token", token);
              //req.headers.authoriztion = "Bearer " + token;

              console.log(token);
              //     res.json({
              //       success: true,
              //       token: token
              //     });

              res.redirect("/");
            });
          });
        }
      }
    );
  }
};
