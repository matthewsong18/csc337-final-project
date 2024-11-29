const mongoose = require("mongoose");
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
}

module.exports = UserService;
