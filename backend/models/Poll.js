const mongoose = require("mongoose");
const { Schema } = mongoose;

const PollSchema = new Schema(
  {
    title: { type: String, required: true },
    options: [
      {
        title: { type: String, required: true },
        vote_count: { type: Number, default: 0 },
      },
    ],
    users_voted: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  {
    timestamps: true,
    validate: {
      // Ensure there is at least one option
      validator: function (options) {
        return options && options.length > 0;
      },
      message: "A poll must have at least one option.",
    },
  }
);

const Poll = mongoose.model("Poll", PollSchema);

module.exports = Poll;

