const mongoose = require("mongoose");
const { Schema } = mongoose;

const ChatSchema = new Schema({
  name: {
    type: String,
    required: false,
  },
  pin: {
    type: Number,
    required: false,
    unique: true,
  },
  users: {
    type: [{ type: Schema.Types.ObjectId, ref: "User" }],
    validate: {
      validator: function (users) {
        return users.length > 0;
      },
      message: "A chat must have at least one user.",
    },
  },
  messages: [{ type: Schema.Types.ObjectId, ref: "Message" }],
  polls: [{ type: Schema.Types.ObjectId, ref: "Poll" }],
});

const Chat = mongoose.model("Chat", ChatSchema);

module.exports = Chat;
