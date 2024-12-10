const mongoose = require("mongoose");
const { Schema } = mongoose;

const ChatSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	pin: {
		type: Number,
		required: true,
		unique: true,
	},
	users: {
		type: [{ type: Schema.Types.ObjectId, ref: "User" }],
	},
	message: [{ type: Schema.Types.ObjectId, ref: "Message" }],
	polls: [{ type: Schema.Types.ObjectId, ref: "Poll" }],
});

const Chat = mongoose.model("Chat", ChatSchema);

module.exports = Chat;
