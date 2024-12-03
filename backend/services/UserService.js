const User = require("../models/User");

class UserService {
  static async createUser(userData) {
    const { user_name } = userData;

    const existing_user = await User.findOne({ user_name: user_name });
    if (existing_user) {
      throw new Error("user_name already exists");
    }

    return await User.create(userData);
  }

  static async findUser(username) {
    const user = await User.findOne({ user_name: username });

    if (!user) {
      throw new Error(`User with username "${username}" not found.`);
    }

    return user;
  }
}

module.exports = UserService;
