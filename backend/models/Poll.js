const mongoose = require("mongoose");
const { Schema } = mongoose;

const PollSchema = new Schema({
  title: { type: String, required: true },
  options: {
    type: [{ type: Schema.Types.ObjectId, ref: "PollOption" }],
    validate: {
      validator: function (options) {
        return options.length > 0;
      },
      message: "A poll must have at least one option.",
    },
  },
  users_voted: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

const Poll = mongoose.model("Poll", PollSchema);

module.exports = Poll;
