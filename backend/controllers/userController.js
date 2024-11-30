const UserService = require("../services/UserService");

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

async function createUser(req, res) {
        // Just placeholder
        const { username } = req.params;
        res.status(200).json(user);
}


module.exports = { getUserByName, createUser};
