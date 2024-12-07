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
  it("should return true when timestamp in correct format", async () => {
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

  it("should return false when timestamp is invalid", async () => {
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
});