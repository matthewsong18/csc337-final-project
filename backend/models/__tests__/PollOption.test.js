const mongoose = require("mongoose");
const { PollOption } = require("..");

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
    await PollOption.deleteMany({});
  });

  it("should create a poll option with a title", async () => {
    const poll_option = await PollOption.create({ title: "A poll option" });

    expect(poll_option.title).toBe("A poll option");
  });
});
