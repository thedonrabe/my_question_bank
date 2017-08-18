var schema = require("mongoose").Schema;

var userSchema = new schema({
  firstName: String,
  lastName: String,
  username: String,
  password: String,
  email: String
});

module.exports = require("mongoose").model("user", userSchema);
