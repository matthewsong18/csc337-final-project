const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../../app"); 
const UserService = require("../../services/UserService");
const { Chat, Message, Poll, PollOption, User } = require("../../models/index");
const { load_chat, load_message_buffer, load_poll_buffer, sort_by_timestamp, is_valid_timestamp } = require("../chatController");

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

  // Validate timestampt format
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
    const user_1 = await User.create({ user_name: "Alice", has_account: true });
    const user_2 = await User.create({ has_account: false });
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
    const user_1 = await User.create({ user_name: "Alice", has_account: true });
    const user_2 = await User.create({ has_account: false });
    const user_3 = await User.create({ user_name: "Bob", has_account: true });
    const user_4 = await User.create({ user_name: "Charlie", has_account: true });
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
  
});