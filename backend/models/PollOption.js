const mongoose = require("mongoose");
const { Schema } = mongoose;

const PollOptionSchema = new Schema({
  title: String,
  vote_count: Number,
});

const PollOption = mongoose.model("PollOption", PollOptionSchema);

module.exports = PollOption;
