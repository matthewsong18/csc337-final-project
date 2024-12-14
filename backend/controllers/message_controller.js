const Chat = require("../models/Chat.js");
const ChatService = require("../services/ChatService.js");
const User = require("../models/User.js");
const Message = require("../models/Message.js");

// TO create a message:
// 1. Extract chat_id, user_id, and message from the request.
// 2. Validate inputs
// 3. If inputs are invalid, respond with 400 and JSON error data.
// 4. Construct the message data object.
// 5. Attempt to save the message using the `saveMessage` function.
// 6. If saving fails, respond with 400 and JSON error data.
// 7. If saving succeeds, call `addMessageToChat` to associate the message with
//    the chat.
const create_message = async (request, response) => {
  try {
    const chat_id = extract_chat_id(request);
    const user_id = extract_user_id(request);
    const message = extract_message(request);

    const input_status = await validate_inputs(chat_id, user_id, message);
    if (input_status.status == 400) {
      respond_with_error_json(response, input_status);
      return;
    }

    const message_id = await save_message(message, user_id);
    await add_message_to_chat(message_id, chat_id);
    response.status(201).json({
      status: 201,
      message: `${message}`,
    });
  } catch (error) {
    respond_with_error_json(response, {
      status: 400,
      error: `${error}`,
    });
  }
};

// TO extract the chat_id:
// 1. Extract chat_id from the request body or query parameters.
// 2. Return the chat_id.
const extract_chat_id = (request) => {
  const { chat_id } = request.params;
  return chat_id;
};

// TO extract the user_id:
// 1. Extract user_id from the request body or query parameters.
// 2. Return the user_id.
const extract_user_id = (request) => {
  const { user_id } = request.params;
  return user_id;
};

// TO extract the message:
// 1. Extract message from the request body or query parameters.
// 2. Return the message.
const extract_message = (request) => {
  const { message_content } = request.params;
  return decodeURIComponent(message_content);
};

// TO validate the inputs:
// 1. Validate chat_id.
// 2. Validate user_id.
// 3. Validate message.
// 4. Return true if both are valid, or respond with 400 and JSON error data.
const validate_inputs = async (chat_id, user_id, message) => {
  const chat_id_status = await validate_chat_id(chat_id);
  const user_id_status = await validate_user_id(user_id);
  const message_status = validate_message(message);
  status = 200;

  if (
    !chat_id_status ||
    !user_id_status ||
    !message_status
  ) {
    status = 400;
  }

  return {
    status: status,
    chat_id_status: chat_id_status,
    user_id_status: user_id_status,
    message_status: message_status,
  };
};

// TO validate chat_id:
// 1. Check that chat_id exists and is in the correct format.
// 2. Query the database to confirm that chat_id refers to an existing chat.
// 3. Return true if valid, or return false if invalid.
const validate_chat_id = async (chat_id) => {
  try {
    const chat = await Chat.findOne({ _id: chat_id });
    if (!chat) return false;
    return true;
  } catch (_error) {
    return false;
  }
};

// TO validate user_id:
// 1. Check that user_id exists and is in the correct format.
// 2. Query the database to confirm that user_id refers to an existing user.
// 3. Return true if valid, or return false if invalid.
const validate_user_id = async (user_id) => {
  try {
    const user = await User.findOne({ _id: user_id });
    if (!user) return false;
    return true;
  } catch (_error) {
    return false;
  }
};

// TO validate message:
// 1. Check that message exists and is in the correct format.
// 2. Return true if valid, or return false if invalid.
const validate_message = (message_string) => {
  if (message_string == null) return false;
  return true;
};

// TO respond with 400 and JSON error data:
// 1. Accept response and JSON error message.
// 2. Send 400 status
// 3. Send JSON with error message
const respond_with_error_json = (response, error_message) => {
  response.status(400).json(error_message);
};

// TO save a message:
// 1. Accept a message data object.
// 2. Attempt to save the message document in the database using the `Message`
//    model or equivalent.
// 3. If saving fails, return an error object with failure details.
// 4. If saving succeeds, return the saved message ID.
const save_message = async (message, user_id) => {
  try {
    const message_document = await Message.create({
      author: user_id,
      content: message,
    });

    return message_document._id;
  } catch (error) {
    throw error;
  }
};

// TO add a message to chat:
// 1. Call ChatService to add message_id to chat.
// 2. If updating the chat fails, return an error object with failure details.
const add_message_to_chat = async (message_id, chat_id) => {
  try {
    await ChatService.add_message(chat_id, message_id);
  } catch (error) {
    throw error;
  }
};

module.exports = {
  create_message,
  extract_chat_id,
  extract_user_id,
  extract_message,
  validate_inputs,
  validate_chat_id,
  validate_user_id,
  validate_message,
  respond_with_error_json,
  save_message,
  add_message_to_chat,
};
