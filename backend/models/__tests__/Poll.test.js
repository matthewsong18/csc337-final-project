const mongoose = require("mongoose");
const { Poll, PollOption } = require("..");

describe("Poll Schema", () => {
  // Connect to a test database before running tests
  beforeAll(async () => {
    await mongoose.connect("mongodb://127.0.0.1:27017/poll_testdb");
  });

  // Disconnect after all tests
  afterAll(async () => {
    await mongoose.connection.close();
  });

  // Clear collections before each test
  beforeEach(async () => {
    await Poll.deleteMany({});
  });

  it("should create a poll with a title and poll option", async () => {
    const poll_option = await PollOption.create({ title: "1" });
    const poll = await Poll.create({
      title: "A poll",
      options: poll_option._id,
    });

    expect(poll.title).toBe("A poll");
    expect(poll.options).toBeDefined();
  });

  it("should not be possible to have a poll without a title", async () => {
    await expect(Poll.create({})).rejects.toThrow();
  });

  it("should ensure that Poll has at least one option", async () => {
    await expect(Poll.create({ title: "title" })).rejects
      .toThrow();

    const poll_option = await PollOption.create({ title: "poll option" });
    await expect(Poll.create({ title: "title", options: [poll_option._id] }))
      .resolves.toBeDefined();
  });
});
