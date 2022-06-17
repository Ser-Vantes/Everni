const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const taskAnswersSchema = new Schema({
  answerFiles: [
    {
      url: {
        type: String,
      },
    },
  ],
  disciplines: {
    ref: "disciplines",
    type: Schema.Types.ObjectId,
  },
  task: {
    ref: "tasks",
    type: Schema.Types.ObjectId,
  },
  user: {
    ref: "users",
    type: Schema.Types.ObjectId,
  },
});

module.exports = mongoose.model("tasksAnswers", taskAnswersSchema);
