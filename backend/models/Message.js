const mongoose = require("mongoose");
const { Schema } = mongoose;

const MessageSchema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: "User" },
  chat: { type: Schema.Types.ObjectId, ref: "Chat" },
  content: String,
  date: { type: Date, default: Date.now() },
});

const Message = mongoose.model("Message", MessageSchema);

module.exports = Message;
