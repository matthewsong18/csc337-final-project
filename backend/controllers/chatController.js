const mongoose = require("mongoose");
const { v4: uuidv4 } = require('uuid');
const { Chat, Message, Poll  } = require("../models/index");

let client_connections = {};

// Implemented by Matthew
// Include update_clients_in_chat before the function's end
function create_message (request, response) {
  const { new_message, chat_id } = request.params;
  update_clients_in_chat(new_message, chat_id);
  response.send("User post message");
}

// TO update all clients in a chat:
// 1. Extract a list of client objects in that chat
// 2. Send new message/poll to all clients connected in that chat 
function update_clients_in_chat (new_update, chat_id) {
  let clients = client_connections[chat_id];
  clients.forEach(client => {
    const updated_data = stringtify_for_sse(new_update)
    send_data_to_client(client.response, updated_data);
  });
}

// TO subscribe to a chat:
// 1. Extract chat_id from the request.
// 2. Validate chat_id
// 3. If input is invalid, respond with 400 and JSON error data.
// 4. Establish SSE connection (call establish_sse_connection)
// 5. Track client connection (track_client_connections)
// 6. Call load_chat to get initial chat buffer
// 7. Convert raw chat_buffer into valid chunk before sending to client
async function subscribe_to_chat (request, response) {
  try {
    const chat_id = extract_chat_id(request);
    await validate_chat_id(chat_id);
    const client_id = track_client_connections(response, chat_id);
    establish_server_sent_events_connection(request, response, chat_id, client_id);
    const chat_buffer = await load_chat(chat_id, Date.now(), 20);
    const updated_data = stringtify_for_sse(chat_buffer);
    send_data_to_client(response, updated_data);
  } catch (error) {
    respond_with_error_json(response, error.message);
    throw new Error(`${error.message}`);
  }
}

// TO extract the chat_id:
// 1. Extract chat_id from the request body or query parameters.
// 2. Return the chat_id.
function extract_chat_id (request) {
  return request.params.chat_id;
}

// TO validate chat_id:
// 1. Validate chat_id's format.
// 2. Validate chat's existence
// 3. Return true if valid, or return false if invalid.
async function validate_chat_id (chat_id) {
  if (!validate_id_format(chat_id)) throw new Error("Invalid chat id");
  if (!await validate_chat_existence(chat_id)) throw new Error("This chat doesn't exist");
}

// TO validate chat_id format:
// 1. Use mongoose.Types.ObjectId.isValid(chat_id);
// 2. Return true if valid and false otherwise
function validate_id_format (id) {
  return mongoose.Types.ObjectId.isValid(id);
}

// TO validate chat_id existence:
// 1. Query the database to confirm that chat_id refers to an existing chat.
// 2. Return true if exists and false otherwise
async function validate_chat_existence (chat_id) {
  const existing_chat = await Chat.findById(chat_id);
  if (!existing_chat || existing_chat === null) return false;
  return true;
}

function respond_with_error_json (response, error_message) {
  response.status(400).json({
    status: 400,
    message: `${error_message}`,
  });
}

// TO establish sse connection:
// 1. Write correct SSE header
// 2. Handle the closing of client request
function establish_server_sent_events_connection (request, response, chat_id, client_id) {
  // Set headers
  response.setHeader('Content-Type', 'text/event-stream');
  response.setHeader('Connection', 'keep-alive');
  response.setHeader('Cache-Control', 'no-cache');
  // Close connection when client closes request
  request.on("close", () => {
    // Remove the client from the chat_id's client_connections
    client_connections[chat_id] = client_connections[chat_id].filter(client => client.id !== client_id);
    response.end(); // close the connection
})
}

// TO track client connection:
// 1. Check if the chat is present in client_connections
// 2. If not create a new one
// 3. Use a uuid for each client
// 4. Store the client object in the chat array
function track_client_connections (response, chat_id) {
  // Check if the chat is present in client_connections
  if (!client_connections[chat_id]) {
      client_connections[chat_id] = [];
  }
  // Use a unique id for each client
  const client_id = uuidv4(); 
  // Add the client to the client_connections object
  client_connections[chat_id].push({
      id: client_id,
      response
  });
  return client_id;
}

// TO send data to client:
// 1. Use res.write(data);
function send_data_to_client (response, data) {
  response.write(data);
}

// TO load a chat:
// 1. Validate timestamp
// 2. Get Chat document
// 3. Call load_message_buffer to get initial message buffer
// 4. Call load_poll_buffer to get initial poll buffer
// 5. Sort messages and polls by timestamp
// 6. Return the sorted chat buffer
async function load_chat (chat_id, timestamp=Date.now(), buffer_size=10) {
  await validate_chat_id(chat_id);
  validate_timestamp(timestamp);
  const chat = await Chat.findById(chat_id);
  const messages = await load_message_buffer(chat.message, timestamp, buffer_size);
  const polls = await load_poll_buffer(chat.polls, timestamp, buffer_size);
  return sort_by_timestamp(messages, polls, buffer_size);
  
}

// TO validate timestamp:
// 1. Validate timestamp's format
// 2. Validate if timestamp is in the future
// 3. Return true if valid and false otherwise
function validate_timestamp (timestamp) {
  if (!validate_timestamp_format(timestamp)) throw new Error("Timestamp's format is invalid");
  if (!validate_if_timestamp_is_future(timestamp)) throw new Error("Timestamp requested is in the future");
}

// TO check for valid timestamp format
// 1. Validate timestamp is not null
// 2. Handle validation when timestamp is of type Date
// 3. Validate if timestamp can be converted to a Date object
// 4. Return true if valid and false otherwise
function validate_timestamp_format (timestamp) {
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
async function load_message_buffer (message_ids, timestamp, buffer_size) {
  if (is_empty_array(message_ids)) return [];
  const messages = await Message.find({
    _id: { $in: message_ids },
    createdAt: { $lte: new Date(timestamp) }, // Filter messages before the given timestamp
  })
  .limit(buffer_size)
  .populate("author", "user_name has_account")
  .select("author content createdAt")
  return messages;
}

// TO validate if array is empty
// 1. Check the length of array
// 2. Return true if it's 0
// 3. Return false otherwise
function is_empty_array (array_input) {
  return array_input.length === 0;
}

// TO load poll buffer:
// 1. Validate id array length
// 2. Get desired poll data by querying Poll schema
// 3. Return that poll buffer
async function load_poll_buffer (poll_ids, timestamp, buffer_size) {
  if (is_empty_array(poll_ids)) return [];
  const polls = await Poll.find({
    _id: { $in: poll_ids},
    createdAt: { $lte: new Date(timestamp) }, // Filter polls before the given timestamp
  })
  .limit(buffer_size)
  .populate("options", "title vote_count")
  .populate("users_voted", "user_name")
  .select("title options users_voted createdAt") // no need to get chat._id
  return polls;
}

// TO sort messages and polls by timestamp:
// 1. Validate the length of messages and polls arrays
// 2. Sort them using built-in sort() method using createdAt property
// 3. Return the sorted chat buffer
function sort_by_timestamp (messages, polls, buffer_size) {
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

module.exports = {
  create_message,
  subscribe_to_chat,
  load_chat,
  load_message_buffer,
  load_poll_buffer,
  sort_by_timestamp, 
  validate_timestamp_format
}