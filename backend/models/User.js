const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema({
  user_name: String,
  has_account: { type: Boolean, default: false },
  chats: [{ type: Schema.Types.ObjectId, ref: "Chat" }],
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
