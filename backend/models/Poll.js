const mongoose = require("mongoose");
const { Schema } = mongoose;

const PollSchema = new Schema({
  title: String,
  options: [{ type: Schema.Types.ObjectId, ref: "PollOption" }],
  users_voted: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

const Poll = mongoose.model("Poll", PollSchema);

module.exports = Poll;
