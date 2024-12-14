const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const UserService = require("../services/UserService");
const { Chat, Message, Poll, User } = require("../models/index");
const { create_message } = require("./message_controller.js");
const path = require("path");

let client_connections = {};

async function message_post(request, response) {
  try {
    const message_id = await create_message(request, response);
    const { chat_pin } = request.params;
    await validate_chat_pin(chat_pin);

    const message_document = await Message.findById(message_id)
      .populate("author", "user_name has_account")
      .select("author content createdAt");
    // const chat = await Chat.findOne({ pin: chat_pin });
    update_clients_in_chat(message_document, chat_pin);
  } catch (_error) {
    // respond_with_error_json(response, 400, { message: error.message });
    return;
  }
}

// TO update all clients in a chat:
// 1. Extract a list of client objects in that chat
// 2. Send new message/poll to all clients connected in that chat
function update_clients_in_chat(new_update, chat_pin) {
  let clients = client_connections[chat_pin];
  clients.forEach((client) => {
    const updated_data = stringtify_for_sse(new_update);
    send_data_to_client(client.response, updated_data);
  });
}

// TO get a chat:
// 1. Extract chat_id from the request.
// 2. Validate chat_id
// 3. If input is invalid, respond with 400 and JSON error data and redirect to error page
// 4. Send chat page to user
async function get_chat(request, response) {
  try {
    const chat_pin = extract_chat_id(request);
    await validate_chat_pin(chat_pin);
    response.sendFile(path.join(__dirname, "../../frontend/public/chat.html"));
  } catch (error) {
    respond_with_error_json(response, 400, { message: error.message }, true);
  }
}

// TO subscribe to a chat:
// 1. Extract chat_id from the request.
// 2. Validate chat_id
// 3. If input is invalid, respond with 400 and JSON error data.
// 4. Establish SSE connection (call establish_sse_connection)
// 5. Track client connection (track_client_connections)
// 6. Call load_chat to get initial chat buffer
// 7. Convert raw chat_buffer into valid chunk before sending to client
async function subscribe_to_chat(request, response) {
  try {
    const chat_pin = extract_chat_id(request);
    await validate_chat_pin(chat_pin);
    const client_id = track_client_connections(response, chat_pin);
    establish_server_sent_events_connection(
      request,
      response,
      chat_pin,
      client_id,
    );
    const chat_buffer = await load_chat(chat_pin, Date.now(), 20);
    const updated_data = stringtify_for_sse(chat_buffer);
    send_data_to_client(response, updated_data);
  } catch (error) {
    respond_with_error_json(response, 400, { message: error.message });
    throw new Error(`${error.message}`);
  }
}

// TO extract the chat_id:
// 1. Extract chat_id from the request body or query parameters.
// 2. Return the chat_id.
function extract_chat_id(request) {
  return request.params.chat_id;
}

// TO validate chat_id:
// 1. Validate chat_id's format.
// 2. Validate chat's existence
// 3. Return true if valid, or return false if invalid.
async function validate_chat_id(chat_id) {
  if (!validate_id_format(chat_id)) throw new Error("Invalid chat id");
  if (!await validate_chat_existence(chat_id)) {
    throw new Error("This chat doesn't exist");
  }
}

// TO validate chat_id format:
// 1. Use mongoose.Types.ObjectId.isValid(chat_id);
// 2. Return true if valid and false otherwise
function validate_id_format(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

// TO validate chat_id existence:
// 1. Query the database to confirm that chat_id refers to an existing chat.
// 2. Return true if exists and false otherwise
async function validate_chat_existence(chat_id) {
  const existing_chat = await Chat.findById(chat_id);
  if (!existing_chat || existing_chat === null) return false;
  return true;
}

function respond_with_error_json(
  response,
  status_code,
  error_json,
  redirect_to_error_page = false,
) {
  if (redirect_to_error_page) {
    const error_message = encodeURIComponent(
      error_json.message || "An unexpected error occurred.",
    );
    const error_page_path = `/error.html?message=${error_message}`;

    response.status(status_code).redirect(error_page_path);
  } else {
    response.status(status_code).json(error_json);
  }
}

// TO establish sse connection:
// 1. Write correct SSE header
// 2. Handle the closing of client request
function establish_server_sent_events_connection(
  request,
  response,
  chat_id,
  client_id,
) {
  // Set headers
  response.setHeader("Content-Type", "text/event-stream");
  response.setHeader("Connection", "keep-alive");
  response.setHeader("Cache-Control", "no-cache");
  // Close connection when client closes request
  request.on("close", () => {
    // Remove the client from the chat_id's client_connections
    client_connections[chat_id] = client_connections[chat_id].filter((client) =>
      client.id !== client_id
    );
    response.end(); // close the connection
  });
}

// TO track client connection:
// 1. Check if the chat is present in client_connections
// 2. If not create a new one
// 3. Use a uuid for each client
// 4. Store the client object in the chat array
function track_client_connections(response, chat_id) {
  // Check if the chat is present in client_connections
  if (!client_connections[chat_id]) {
    client_connections[chat_id] = [];
  }
  // Use a unique id for each client
  const client_id = uuidv4();
  // Add the client to the client_connections object
  client_connections[chat_id].push({
    id: client_id,
    response,
  });
  return client_id;
}

// TO send data to client:
// 1. Use res.write(data);
function send_data_to_client(response, data) {
  response.write(data);
}

// TO load a chat:
// 1. Validate timestamp
// 2. Get Chat document
// 3. Call load_message_buffer to get initial message buffer
// 4. Call load_poll_buffer to get initial poll buffer
// 5. Sort messages and polls by timestamp
// 6. Return the sorted chat buffer
async function load_chat(chat_pin, timestamp = Date.now(), buffer_size = 10) {
  await validate_chat_pin(chat_pin);
  validate_timestamp(timestamp);
  const chat = await Chat.findOne({ pin: chat_pin });
  const messages = await load_message_buffer(
    chat.messages,
    timestamp,
    buffer_size,
  );
  const polls = await load_poll_buffer(chat.polls, timestamp, buffer_size);
  return sort_by_timestamp(messages, polls, buffer_size);
}

// TO validate timestamp:
// 1. Validate timestamp's format
// 2. Validate if timestamp is in the future
// 3. Return true if valid and false otherwise
function validate_timestamp(timestamp) {
  if (!validate_timestamp_format(timestamp)) {
    throw new Error("Timestamp's format is invalid");
  }
  if (!validate_if_timestamp_is_future(timestamp)) {
    throw new Error("Timestamp requested is in the future");
  }
}

// TO check for valid timestamp format
// 1. Validate timestamp is not null
// 2. Handle validation when timestamp is of type Date
// 3. Validate if timestamp can be converted to a Date object
// 4. Return true if valid and false otherwise
function validate_timestamp_format(timestamp) {
  if (timestamp === null) {
    return false;
  }
  if (typeof timestamp === "Date") {
    // timestamp = timestamp.toString();
    return !isNaN(timestamp.getTime());
  }
  const date = new Date(timestamp);
  return !isNaN(date.getTime());
}

// TO check for valid timestamp logic
// 1. Validate if timestamp is in the future
// 2. Return true if valid and false otherwise
function validate_if_timestamp_is_future(timestamp) {
  return (new Date(timestamp) <= Date.now());
}

// TO load message buffer:
// 1. Validate the id array length
// 2. Get desired message data by querying Message schema
// 3. Return that message buffer
async function load_message_buffer(message_ids, timestamp, buffer_size) {
  if (is_empty_array(message_ids)) return [];
  const messages = await Message.find({
    _id: { $in: message_ids },
    createdAt: { $lte: new Date(timestamp) }, // Filter messages before the given timestamp
  })
    .limit(buffer_size)
    .populate("author", "user_name has_account")
    .select("author content createdAt");
  return messages;
}

// TO validate if array is empty
// 1. Check the length of array
// 2. Return true if it's 0
// 3. Return false otherwise
function is_empty_array(array_input) {
  return array_input.length === 0;
}

// TO load poll buffer:
// 1. Validate id array length
// 2. Get desired poll data by querying Poll schema
// 3. Return that poll buffer
async function load_poll_buffer(poll_ids, timestamp, buffer_size) {
  if (is_empty_array(poll_ids)) return [];
  const polls = await Poll.find({
    _id: { $in: poll_ids },
    createdAt: { $lte: new Date(timestamp) }, // Filter polls before the given timestamp
  })
    .limit(buffer_size)
    .populate("options", "title vote_count")
    .populate("users_voted", "user_name")
    .select("title options users_voted createdAt"); // no need to get chat._id
  return polls;
}

// TO sort messages and polls by timestamp:
// 1. Validate the length of messages and polls arrays
// 2. Sort them using built-in sort() method using createdAt property
// 3. Return the sorted chat buffer
function sort_by_timestamp(messages, polls, buffer_size) {
  const chat_history = [...messages, ...polls];
  if (is_empty_array(chat_history)) return chat_history;
  // Sort by createdAt in ascending order (latest -> oldest)
  chat_history.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  if (buffer_size >= chat_history.length) return chat_history;
  return chat_history.slice(buffer_size);
}

function stringtify_for_sse(raw_data) {
  return `data: ${JSON.stringify(raw_data)}\n\n`;
}

// TO join a chat:
// 1. Validate chat_pin.
// 2. Identify the user based on user_id stored on cookie
// 3. If there's an id found, use it to link user and chat
// 4. If not found, assume it's a guest user and create a new User document
// 5. Repond accordingly to user
async function join_chat_guest(req, res) {
  const chat_pin = req.params.chat_pin;
  const new_user = await UserService.create_guest_user();
  await join_chat(new_user, chat_pin, res);
}

async function join_chat_user(req, res) {
  const { username, chat_pin } = req.params;
  console.log(username);
  console.log(chat_pin);
  const user = await User.findOne({ user_name: username });
  await join_chat(user, chat_pin, res);
}

async function join_chat(user, chat_pin, res) {
  console.log("GET request received");

  try {
    console.log("Attempting to find chat");
    await validate_chat_pin(chat_pin);

    const chat = await Chat.findOne({ pin: chat_pin });
    console.log("Chat found");

    // link chat and user together
    await update_chat_history(user, chat);
    res.status(200).json({
      exists: true,
      chat_pin: chat.pin,
      user_id: user._id,
    });
  } catch (error) {
    console.error("Error checking chatroom existence:", error);
    respond_with_error_json(res, 400, {
      exists: false,
      message: error.message,
    });
  }
}
// TO validate chat_pin:
// 1. Validate chat_pin's format.
// 2. Validate chat's existence
// 3. Return true if valid, or return false if invalid.
async function validate_chat_pin(chat_pin) {
  if (!validate_pin_format(chat_pin)) throw new Error(`Invalid chat pin`);
  if (!await Chat.findOne({ pin: chat_pin })) {
    throw new Error("This chat doesn't exist");
  }
}

function validate_pin_format(chat_pin) {
  // Check length
  if (String(chat_pin).length !== 8) return false;
  // Ensure it only contains digits
  if (!/^\d+$/.test(chat_pin)) return false;
  return true;
}

// TO create a chat:
// 1. Generate a random chat pin
// 2. Identify the user based on user_id stored on cookie
// 3. If there's an id found, use it to link user and chat
// 4. If not found, assume it's a guest user and create a new User document
// 5. Respond accordingly to user
async function create_chat_guest(req, res) {
  // Before we have cookie, assume this function is create request for guest user
  const new_user = await UserService.create_guest_user();
  const chat_name = "Anonymous Chat"; // Set a default chat name

  // Create a new chat document
  await create_chat(new_user, chat_name, res);
}

async function create_chat_user(req, res) {
  const { username, chat_name } = req.params;

  // Before we have cookie, assume this function is create request for users with accounts
  const user = await User.findOne({ user_name: username });

  // Create a new chat document
  await create_chat(user, chat_name, res);
}

async function create_chat(user, chat_name, res) {
  console.log("POST request recieved");
  const pin = await generate_unique_pin(); // Generate a random PIN
  console.log("Attempting to create new Chat");

  try {
    // Create a new chat document
    const new_chat = await Chat.create({
      name: chat_name,
      pin: pin,
      users: [user._id],
      message: [], // No messages initially
    });

    console.log("Chat created successfully");
    // Link chat to user
    await update_chat_history(user, new_chat);

    res.status(200).json({ chat_pin: pin, user_id: user._id });
  } catch (error) {
    console.error("Error creating chat:", error);
    return respond_with_error_json(res, 500, { message: error.message });
  }
}

async function update_chat_history(user, chat) {
  try {
    // console.log(JSON.stringify(user, null, 2));
    // only add to user's chat history if it isn't already there
    if (user.has_account && !user.chats.includes(chat._id)) {
      await user.chats.push(chat._id);
      await user.save();
    }

    // Add the user to the chat's user list if not already there
    if (!chat.users.includes(user._id)) {
      await chat.users.push(user._id);
      await chat.save();
    }
    console.log("Successfully updated chat history");
    return;
  } catch (error) {
    console.error("Error updating chat history:", error);
    return;
  }
}

//TO generate unique random pin (and actively retry if a pin was used)
// 1. Generate a random pin
// 2. Check if that pin was assigned to any chat documents
// 3. If yes, re-generate new one and re-check (limit 100 times)
// 4. If not, return that pin
async function generate_unique_pin() {
  let retries = 0;
  const maxRetries = 100; // Limit to prevent infinite loop
  let pin;
  while (retries < maxRetries) {
    pin = Math.floor(10000000 + Math.random() * 90000000);
    const existingChat = await Chat.findOne({ pin: pin });
    if (!existingChat) {
      console.log(`Generated unique PIN: ${pin}`);
      return pin;
    }
    console.log(`Retry ${retries + 1}: PIN ${pin} already exists`);
    retries++;
  }
  throw new Error("Failed to generate unique PIN after multiple attempts");
}

module.exports = {
  get_chat,
  message_post,
  subscribe_to_chat,
  load_chat,
  load_message_buffer,
  load_poll_buffer,
  sort_by_timestamp,
  validate_timestamp_format,

  create_chat_guest,
  create_chat_user,
  join_chat_guest,
  join_chat_user,
  join_chat,
  create_chat,
  generate_unique_pin,
};
