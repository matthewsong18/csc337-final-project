const UserService = require("../services/UserService");

async function user_signup(request, response) {
  try {
    const { user_name } = request.params;
    await create_new_user(user_name);
    response.status(201).json({
      status: 201,
      message: `User successfully signed-up as ${user_name}`,
    });
  } catch (error) {
    response.status(400).json({
      status: 400,
      message: error,
    });
  }
}

async function create_new_user(user_name) {
  try {
    return await UserService.createUser(user_name);
  } catch (error) {
    throw new Error(`Error creating user: ${error}`);
  }
}

async function getUserByName(req, res) {
  const { username } = req.params;

  try {
    const user = await UserService.findUser(username);
    // Call view for profile of user
    res.status(200).json(user);
  } catch (error) {
    // Call view for error finding user
    res.status(404).json({ message: error.message });
  }
}

module.exports = {
  getUserByName,
  user_signup,
  create_new_user,
};
