const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema({
  user_name: { type: String, unique: true, sparse: true },
  has_account: { type: Boolean, default: false },
  chats: [{ type: Schema.Types.ObjectId, ref: "Chat" }],
});

// Middleware: Validate user data before saving
UserSchema.pre("save", function (next) {
  if (!this.has_account && this.user_name) {
    return next(new Error("Guest users cannot have a user_name."));
  }
  if (this.has_account && !this.user_name) {
    return next(new Error("The user has an account, but no user_name."));
  }
  next();
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
