const request = require("supertest");
const mongoose = require("mongoose");
const http = require("http");
const axios = require("axios");
const app = require("../../app"); 
const UserService = require("../../services/UserService");
const { Chat, Message, Poll, PollOption, User } = require("../../models/index");
const { load_chat, load_message_buffer, load_poll_buffer, sort_by_timestamp, is_valid_timestamp } = require("../chatController");
const { subscribe_chat } = require("../chatController");

describe("chatController", () => {

  beforeAll(async () => {
    await mongoose.connect("mongodb://localhost:27017/testdb");
  });

  afterAll(async () => {
      await mongoose.connection.close();
  });
  
  beforeEach(async () => {
    await User.deleteMany({});
    await Chat.deleteMany({});
    await Message.deleteMany({});
    await Poll.deleteMany({});
    await PollOption.deleteMany({})
  });

  // Validate timestamp format
  it("should return true when timestamp in correct format", () => {
    const timestamp_1 = is_valid_timestamp("2022-02-26T16:37:48.244Z"); // createdAt format
    const timestamp_2 = is_valid_timestamp("2024-12-06T12:00:00Z"); // Date format
    const timestamp_no_ms = is_valid_timestamp("2024-12-06T12:00:00Z");
    const timestamp_no_timezone = is_valid_timestamp("2024-12-06T12:00:00");
    const timestamp_offset = is_valid_timestamp("2024-12-06T12:00:00+05:30");
    const timestamp_no_separator = is_valid_timestamp("2024-12-06 12:00:00Z");
    const timestamp_nonstring = is_valid_timestamp(Date.now());
    expect(timestamp_1).toBe(true);
    expect(timestamp_2).toBe(true);
    expect(timestamp_no_ms).toBe(true);
    expect(timestamp_no_timezone).toBe(true);
    expect(timestamp_offset).toBe(true);
    expect(timestamp_no_separator).toBe(true);
    expect(timestamp_nonstring).toBe(true);
  });

  it("should return false when timestamp is invalid", () => {
    const timestamp_null = is_valid_timestamp(null);
    const timestamp_undefined = is_valid_timestamp(undefined);
    const timestamp_malformed = is_valid_timestamp("2024-12-06A12:00:00G");
    const timestamp_string = is_valid_timestamp("hello world");
    const timestamp_wrong_order = is_valid_timestamp("12:00:00T2024-12-06");
    const timestamp_extra_characters = is_valid_timestamp("2024-12-06T12:00:00Zabc");
    const timestamp_empty_string = is_valid_timestamp("");
    expect(timestamp_null).toBe(false);
    expect(timestamp_undefined).toBe(false);
    expect(timestamp_malformed).toBe(false);
    expect(timestamp_string).toBe(false);
    expect(timestamp_wrong_order).toBe(false);
    expect(timestamp_extra_characters).toBe(false);
    expect(timestamp_empty_string).toBe(false);
  });

  // check load message buffer
  it("should return an array of objects of messages sorted by timestamp, buffer size", async () => {
    let message_ids = [];
    const user_1 = await UserService.createUser("Alice");
    const user_2 = await User.create({});
    for (let i = 0; i < 10; i++) {
        const message = await Message.create({
            author: i % 2 == 0 ? user_1._id : user_2._id,
            content: `Message #${i+1}`,
        });
        message_ids.push(message._id);
    }
    const messages = await load_message_buffer(message_ids, 8, Date.now());
    // validate all fields desire
    let message_1 = messages[0];
    expect(message_1.author).toBeDefined();
    expect(message_1.author._id == user_1._id.toString()).toBe(true);
    expect(message_1.content).toBeDefined();
    expect(message_1.content).toBe("Message #1");
    expect(message_1.createdAt).toBeDefined();
    expect(is_valid_timestamp(message_1.createdAt)).toBeTruthy();
    
    let message_2 = messages[1];
    expect(message_2.author).toBeDefined();
    expect(message_2.author._id == user_2._id.toString()).toEqual(true);
    expect(message_2.content).toBeDefined();
    expect(message_2.content).toBe("Message #2");
    expect(message_2.createdAt).toBeDefined();
    expect(is_valid_timestamp(message_2.createdAt)).toBeTruthy();

    // check buffer size
    expect(messages.length).toBe(8);
  });

  it("should return an empty array when there's no message id", async () => {
    const messages = await load_message_buffer([], 8, Date.now());
    expect(messages.length).toBe(0);
  });

  // check load poll buffer
  it("should return an array of objects of polls sorted by timestamp, buffer size", async () => {
    let poll_ids = [];
    let poll_option_ids = [];
    const user_1 = await UserService.createUser("Alice");
    const user_2 = await User.create({});
    const user_3 = await UserService.createUser("Bob");
    const user_4 = await UserService.createUser("Charlie");
    for (let i = 0; i < 8; i++) {
        const poll_option = await PollOption.create({
            title: `Option #${i+1}`,
        })
        poll_option_ids.push(poll_option._id);
    }
    const poll_1 = await Poll.create({
        title: "Poll Title 1",
        options: poll_option_ids.slice(0, 4),
        users_voted: [user_1, user_2, user_3, user_4],
    });
    poll_ids.push(poll_1._id);
    const poll_2 = await Poll.create({
        title: "Poll Title 2",
        options: poll_option_ids.slice(4),
        users_voted: [user_1, user_2, user_3],
    });
    poll_ids.push(poll_2._id);
    
    const polls = await load_poll_buffer(poll_ids, 8, Date.now());
    // validate all fields desire
    expect(poll_1.title).toBeDefined();
    expect(poll_1.title).toBe("Poll Title 1");
    expect(poll_1.options).toBeDefined();
    expect(poll_1.options[0]._id == poll_option_ids[0].toString()).toBe(true);
    expect(poll_1.users_voted).toBeDefined();
    expect(poll_1.users_voted.length).toBe(4);
    expect(poll_1.createdAt).toBeDefined();
    expect(is_valid_timestamp(poll_1.createdAt)).toBeTruthy();
    
    expect(poll_2.title).toBeDefined();
    expect(poll_2.title).toBe("Poll Title 2");
    expect(poll_2.options).toBeDefined();
    expect(poll_2.options[0]._id == poll_option_ids[4].toString()).toBe(true);
    expect(poll_2.users_voted).toBeDefined();
    expect(poll_2.users_voted.length).toBe(3);
    expect(poll_2.createdAt).toBeDefined();
    expect(is_valid_timestamp(poll_2.createdAt)).toBeTruthy();

    // check buffer size
    expect(polls.length).toBe(2);
  });

  it("should return an empty array when there's no poll id", async () => {
    const polls = await load_poll_buffer([], 8, Date.now());
    expect(polls.length).toBe(0);
  });

  // check sorting polls and messages by timestamp
  it("should return an array of messages and polls sorted in ascending time order", async () => {
    const user = await UserService.createUser("Test User");
    const message_ids = [];
    const poll_ids = [];
    // Create messages with different timestamps
    const message1 = await Message.create({
        author: user._id,
        content: "Message 1",
        createdAt: new Date("2024-12-08T10:00:00Z"),
    });
    message_ids.push(message1._id);
    const message2 = await Message.create({
        author: user._id,
        content: "Message 2",
        createdAt: new Date("2024-12-08T10:02:00Z"),
    });
    message_ids.push(message2._id);
    // Create polls with different timestamps
    const pollOption1 = await PollOption.create({ title: "Option 1" });
    const pollOption2 = await PollOption.create({ title: "Option 2" });

    const poll1 = await Poll.create({
        title: "Poll 1",
        options: [pollOption1._id],
        createdAt: new Date("2024-12-08T10:01:30Z"),
    });
    poll_ids.push(poll1._id);
    const poll2 = await Poll.create({
        title: "Poll 2",
        options: [pollOption2._id],
        createdAt: new Date("2024-12-08T10:00:30Z"),
    });
    poll_ids.push(poll2._id);
    // Combine messages and polls
    const messages = await load_message_buffer(message_ids, 2, Date.now());
    const polls = await load_poll_buffer(poll_ids, 2, Date.now());

    // Sort combined array by timestamp
    const sorted = sort_by_timestamp(messages, polls, 4);

    // Validate the order
    expect(sorted[0].createdAt).toBe(messages[0].createdAt); // Message 1
    expect(sorted[1].createdAt).toBe(polls[1].createdAt); // Poll 2
    expect(sorted[2].createdAt).toBe(polls[0].createdAt); // Poll 1
    expect(sorted[3].createdAt).toBe(messages[1].createdAt); // Message 2
    
    // Check buffer size
    expect(sorted.length).toBe(4);
  });

  it("should return an empty array when there's no polls and messages", async () => {
    const chat_history = await sort_by_timestamp([], [], 6);
    expect(chat_history.length).toBe(0);
  });

  // check load chat with all functions combined
  it("should throw an error for an invalid chat ID", async () => {
    let error;
    try {
        const invalid_chat_id = "123"; // Not a valid ObjectId format
        await load_chat(invalid_chat_id, Date().now, 10);
    } catch (err) {
        error = err;
    }
    expect(error).toBeDefined();    
    expect(error.message).toBe("Invalid chat id");
  });

  it("should throw an error for a non-existent chat", async () => {
    let error;
    try {
        const valid_but_nonexistent_id = new mongoose.Types.ObjectId();
        await load_chat(valid_but_nonexistent_id, Date().now);
    } catch (err) {
        error = err;
    }
    expect(error).toBeDefined();    
    expect(error.message).toBe("This chat doesn't exist");
  });
  
  it("should throw an error for an invalid timestamp format", async () => {
    let error;
    try {
        const user = await User.create({});
        const chat = await Chat.create({ title: "Test Chat", message: [], polls: [], users: [user]});
        const invalid_timestamp = "invalid-date";
        await load_chat(chat._id, invalid_timestamp);
    } catch (err) {
        error = err;
    }
    expect(error).toBeDefined();    
    expect(error.message).toBe("Timestamp requested is invalid");
  });

  it("should throw an error if the timestamp is in the future", async () => {
    let error;
    try {
        const user = await User.create({});
        const chat = await Chat.create({ title: "Test Chat", message: [], polls: [], users: [user]});
        let now = new Date();
        let future = now.setDate(now.getDate() + 3); // Add 3 days
        await load_chat(chat._id, future);
    } catch (err) {
        error = err;
    }
    expect(error).toBeDefined();    
    expect(error.message).toBe("Timestamp requested is in the future");
  });

  it("should return an empty array if no messages or polls exist in the chat", async () => {
    const user = await User.create({});
    const chat = await Chat.create({ title: "Empty Chat", message: [], polls: [], users: [user] });
    const result = await load_chat(chat._id, Date.now());
    expect(result.length).toBe(0);
  });

  it("should return sorted messages and polls for a valid request", async () => {
    const user = await UserService.createUser("Test User");

    // Create messages and polls
    const message1 = await Message.create({
      author: user._id,
      content: "Message 1",
      createdAt: new Date("2024-12-01T10:00:00Z"),
    });

    const message2 = await Message.create({
      author: user._id,
      content: "Message 2",
      createdAt: new Date("2024-12-01T12:00:00Z"),
    });

    const pollOption1 = await PollOption.create({ title: "Option 1" });
    const pollOption2 = await PollOption.create({ title: "Option 2" });
    const poll = await Poll.create({
      title: "Poll 1",
      options: [pollOption1, pollOption2],
      createdAt: new Date("2024-12-01T11:00:00Z"),
    });

    // Create chat
    const chat = await Chat.create({
      title: "Test Chat",
      message: [message1._id, message2._id],
      polls: [poll._id],
      users: [user]
    });

    // Call load_chat
    const result = await load_chat(chat._id, Date.now());

    expect(result.length).toBe(3); // 2 messages + 1 poll
    expect(result[0].content).toBe("Message 1");
    expect(result[1].title).toBe("Poll 1");
    expect(result[2].content).toBe("Message 2");
    expect(result.every((item) => is_valid_timestamp(item.createdAt))).toBeTruthy();
  });

  // Check subscribe_chat function for streaming
  it('should set proper headers and send initial chat buffer', async () => {
    const user = await UserService.createUser("Test User");

    // Create messages and polls
    const message1 = await Message.create({
      author: user._id,
      content: "Message 1",
      createdAt: new Date("2024-12-01T10:00:00Z"),
    });

    const message2 = await Message.create({
      author: user._id,
      content: "Message 2",
      createdAt: new Date("2024-12-01T12:00:00Z"),
    });

    const pollOption1 = await PollOption.create({ title: "Option 1" });
    const pollOption2 = await PollOption.create({ title: "Option 2" });
    const poll = await Poll.create({
      title: "Poll 1",
      options: [pollOption1, pollOption2],
      createdAt: new Date("2024-12-01T11:00:00Z"),
    });

    // Create chat
    const chat = await Chat.create({
      title: "Test Chat",
      message: [message1._id, message2._id],
      polls: [poll._id],
      users: [user]
    });

    // create a server
    var httpServer = http.createServer(function(req, res){ 
      const url = new URL(req.url, `http://${req.headers.host}`);
      // Match the route and extract the `chat_id`
      if (url.pathname.startsWith('/chat/') && url.pathname.endsWith('/events')) {
        const chatIdMatch = url.pathname.match(/^\/chat\/([^/]+)\/events$/);
        if (chatIdMatch) {
            // Manually add `params` to the request object
            req.params = { chat_id: chatIdMatch[1] };
            subscribe_chat(req, res);
        } else {
            res.statusCode = 404;
            res.end('Not Found');
        }
      } else {
        res.statusCode = 404;
        res.end('Not Found');
      }
      req.on('close', () => {
        res.end(); // close the connection
      })
    }); 
      
    // Listening to http Server 
    httpServer.listen(3009, 'localhost', () => { 
        console.log("Server is running at port 3009..."); 
        console.log(`/chat/${chat._id}/events`);
    }); 

    const req_url = `http://localhost:3009/chat/${chat._id}/events`;
    // Create an AbortController instance to close the request
    const controller = new AbortController();
    const signal = controller.signal;
    
    const response = await axios({
      method: 'GET',
      url: req_url,
      responseType: 'stream',
      signal,
    });

    // check response headers
    expect(response.headers["content-type"]).toBe("text/event-stream");
    expect(response.headers["cache-control"]).toBe("no-cache");
    expect(response.headers["connection"]).toBe("keep-alive");
    expect(response.headers["transfer-encoding"]).toBe("chunked");

    // check response data
    // Create a buffer to store the streamed data
    let receivedData = '';
    // listen for updates
    response.data.on('data', (chunk) => {
        receivedData += chunk.toString(); // Accumulate the chunks
        expect(receivedData).toContain('data: '); // Ensure it follows the SSE format
        const parsedData = JSON.parse(receivedData.split('data: ')[1]); // Extract and parse the data
        expect(parsedData.length).toBe(3);
        expect(parsedData[0]._id == message1._id.toString()).toBe(true);
        expect(parsedData[1]._id == poll._id.toString()).toBe(true);
        expect(parsedData[2]._id == message2._id.toString()).toBe(true);
        controller.abort(); // close the request
        httpServer.close();
    });
  });

  
});