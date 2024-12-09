const UserService = require("../services/UserService");

async function user_signup(request, response) {
  try {
    const user_name = get_user_name(request);
    const user = await create_new_user(user_name);
    response.status(201).json({
      status: 201,
      message: `User successfully signed-up as ${user_name}`,
      user_id: user._id,
    });
  } catch (error) {
    response.status(400).json({
      status: 400,
      message: `${error}`,
    });
  }
}

function get_user_name(request) {
  const { user_name } = request.params;
  return decodeURIComponent(user_name);
}

async function create_new_user(user_name) {
  try {
    return await UserService.createUser(user_name);
  } catch (error) {
    throw error;
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
