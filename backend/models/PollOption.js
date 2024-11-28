const mongoose = require("mongoose");
const { Schema } = mongoose;

const PollOptionSchema = new Schema({
  title: { type: String, required: true },
  vote_count: Number,
});

const PollOption = mongoose.model("PollOption", PollOptionSchema);

module.exports = PollOption;
