var router = require("express").Router;
var user = require("../models/user");
var bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
var users = require("../models/user");

exports.getLogin = function(req, res) {
  res.render("login", {});
};

exports.registerUser = function(req, res) {
  // check to see if the user is in the db
  user.findOne(
    {
      username: req.body.username
    },
    function(err, data) {
      if (err) throw err;
      //console.log(data);

      // if we don't find the user then tell the user it wasn't found
      if (!data) {
        res.json({
          success: false,
          message: "Incorrect username entered"
        });
      } else if (data) {
        // if the user is found, check the password
        bcrypt.compare(req.body.password, data.password, function(
          err,
          cryptRes
        ) {
          // if the user is found but the password doesn't match, tell the user
          if (!cryptRes) {
            // incorrect password
            res.json({
              success: false,
              message: "Incorrect password entered"
            });
          } else {
            // create token as password is correct
            var token = jwt.sign(data, req.app.get("secret"), {
              expiresIn: 3600
            });

            // set newly created token
            req.app.set("token", token);

            //   res.json({
            //     success: true,
            //     message: "Token created",
            //     token: token
            //  });

            // once the user is logged in send them back to the question list
            res.redirect("/");
          }
        });
      }
    }
  );
};
