const mongoose = require("mongoose");
const { Schema } = mongoose;

const PollOptionSchema = new Schema({
  title: { type: String, required: true },
  vote_count: { type: Number, default: 0 },
});

const PollOption = mongoose.model("PollOption", PollOptionSchema);

module.exports = PollOption;
