const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const taskSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  taskText: {
    type: String,
    required: true,
  },
  deadline: {
    type: Date,
    default: Date.now,
  },
  taskFiles: [
    {
      title: {
        type: String,
      },
      url: {
        type: String,
      },
      _id: {
        type: Number,
      },
    },
  ],
  disciplines: {
    ref: "disciplines",
    type: Schema.Types.ObjectId,
  },
  chapters: {
    ref: "chapters",
    type: Schema.Types.ObjectId,
  },
});

module.exports = mongoose.model("tasks", taskSchema);
