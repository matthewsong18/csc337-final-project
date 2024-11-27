const mongoose = require("mongoose");
const { Poll } = require("..");

describe("Poll Schema", () => {
  // Connect to a test database before running tests
  beforeAll(async () => {
    await mongoose.connect("mongodb://localhost:27017/testdb");
  });

  // Disconnect after all tests
  afterAll(async () => {
    await mongoose.connection.close();
  });

  // Clear collections before each test
  beforeEach(async () => {
    await Poll.deleteMany({});
  });

  it("should create a poll with a title", async () => {
    const poll = await Poll.create({ title: "A poll" });

    expect(poll.title).toBe("A poll");
  });
});
