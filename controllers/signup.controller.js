var router = require("express").Router;
var user = require("../models/user");
var bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
var users = require("../models/user");
//var app = require("../app");

exports.getSignUp = function(req, res, next) {
  // render the signup page
  res.render("signup", {
    title: "Sign Up"
  });
};

exports.createUserObj = function(req, res, next) {
  // validate client inputs and check inputted user data
  req.checkBody("firstName", "Please enter your first name").notEmpty();
  //req.sanitize("question").checkCasing(); // special custom validator created in app.js
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
  req.sanitize("email").trim();
  req.checkBody("email", "Please enter a valid email address").isEmail();

  var errs = req.validationErrors();
  if (errs) {
    // if the user hasn't filled in the required fields rerender and tell user
    res.render("signup", {
      title: "Sign In",
      errors: errs,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      username: req.body.username,
      email: req.body.email
    });
  } else {
    // first check if the user data entered already exists in the db
    users.findOne(
      { $or: [{ email: req.body.email }, { username: req.body.username }] },
      function(err, data) {
        if (err) throw err;

        // if the db search finds a user with entered data already in the system handle it
        if (data) {
          // if the data matches tell user that is already exists
          if (
            data.email == req.body.email ||
            data.username == req.body.username
          ) {
            res.render("signup", {
              title: "Sign In",
              errors: [
                {
                  msg:
                    "A User Has Already Been Created With This Email Address or Username. Choose another or sign in."
                }
              ],
              firstName: req.body.firstName,
              lastName: req.body.lastName,
              username: req.body.username,
              email: req.body.email
            });
          }
        } else {
          // if the user isn't already in the db hash the password
          bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(req.body.password, salt, function(err, hash) {
              var tempUser = new user({
                username: req.body.username,
                password: hash,
                email: req.body.email,
                firstName: req.body.firstName,
                lastName: req.body.lastName
              });

              // save the new user to the db
              tempUser.save(function(err, payload) {
                if (err) return next(err);
              });

              // create token
              var token = jwt.sign(tempUser, req.app.get("secret"), {
                expiresIn: 3600
              });

              // set the token value in the app.locals.token
              res.app.set("token", token);

              // test outputs
              // console.log(token);
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
