var express = require("express");
var path = require("path");
var favicon = require("serve-favicon");
var logger = require("morgan");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcrypt");

// add validator
var expressValidator = require("express-validator");

var index = require("./routes/index");
//var users = require("./routes/users");
var newQuestion = require("./routes/newquestion");
var updateQuestion = require("./routes/updatequestion");
var signup = require("./routes/signup");
var login = require("./routes/login");
// global variable to pass around object
//var questions = require("../models/newquestion");

var app = express();
app.set("token", "");

app.use(function(req, res, next) {
  //console.log("====> THIS SHIT" + req.headers);
  //console.log(req.headers.authorization);
  //console.log(req.cookies);
  if (app.get("token")) {
    jwt.verify(app.get("token"), app.get("secret"), function(err, decode) {
      if (err) req.user = undefined;
      //console.log(decode);
      console.log("SUCCESSSSS!!");
      req.user = decode;
      next();
    });
  } else {
    req.user = undefined;
    next();
  }
});

app.locals.objectToPass = {
  _id: "",
  question: "",
  answer: "",
  author: "" //,
  //created: Date.now(), -- there is some built in stuffs
  //updated: Date.now()
};

mongoose.connect("mongodb://admin:admin@ds155631.mlab.com:55631/questionbank");

var db = mongoose.connection;

db.on("error", console.error.bind(console, "can't find shit captain: "));
db.once("open", function() {
  console.log("db connected bitch!");
});

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// add for the validator
//app.use(expressValidator());
// custom validators
app.use(
  expressValidator({
    customSanitizers: {
      checkCasing: function(value) {
        var rg = /(^\s*\w{1}|\.\s*\w{1})/gi;
        value = value.toLowerCase();
        value = value.replace(rg, function(toReplace) {
          return toReplace.toUpperCase();
        });

        return value;
        //var retString = "";
      }
    }
  })
);

app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", index);
//app.use("/users", users);
app.use("/newquestion", newQuestion);
app.use("/updatequestion", updateQuestion);
app.use("/signup", signup);
app.use("/login", login);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

// // custom validators
// app.use(
//   expressValidator({
//     customSanitizers: {
//       checkCasing: function(value) {
//         var rg = /(^\s*\w{1}|\.\s*\w{1})/gi;
//         value.toLowerCase();
//         value = value.replace(rg, function(toReplace) {
//           return toReplace.toUpperCase();
//         });

//         return value;
//         //var retString = "";
//       }
//     }
//   })
// );
app.set("secret", "superawesomesecretword");
module.exports = app;
// module.exports = (
//   {
//     secret: "thisandthat"
//   },
//   app
// );
