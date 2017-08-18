var router = require("express").Router();
var user = require("../models/user");
var bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");

router.get("/", function(req, res) {
  res.render("login", {});
});

router.post("/", function(req, res) {
  user.findOne(
    {
      username: req.body.username
    },
    function(err, data) {
      if (err) throw err;
      console.log(data);
      if (!data) {
        res.json({
          success: false,
          message: "Incorrect username entered"
        });
      } else if (data) {
        bcrypt.compare(req.body.password, data.password, function(
          err,
          cryptRes
        ) {
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

            req.app.set("token", token);
            //   res.json({
            //     success: true,
            //     message: "Token created",
            //     token: token
            //  });
            res.redirect("/");
          }
        });
      }
    }
  );
});

module.exports = router;
