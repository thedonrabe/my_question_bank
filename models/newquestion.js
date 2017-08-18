var mongoose = require("mongoose");
//var schema = mongoose.Schema;
var schema = require("mongoose").Schema;

var newQuestionSchema = new schema(
  {
    _id: String,
    question: String,
    answer: String,
    author: String
    /*
    question: {
      type: String,
      required: true
    },
    answer: {
      type: String,
      required: true
    },
    author: {
      type: String,
      required: true
    }
    //created: Date,
    //updated: Date
    */
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("question", newQuestionSchema, "questions");
