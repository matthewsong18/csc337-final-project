const db = require("../config/db");

async function getUserByName(req, res) {
    const { username } = req.params;

    const user = await db.getUserByName(username);

    if (!user) {
    res.status(404).send("User not found");
    return;
    }

    console.log(`Username: ${username}`);
    res.send(`User ID: ${user.id}`);
    return;
};

async function createUser(req, res) {
    const { username } = req.params;

    const user = await db.getUserByName(username);

    if (!user) {
        // append to the db
        await db.createUser(username);
        // redirect to profile page
        try {
            res.redirect(`/profile/${username}`);
        } catch (error) {
            console.error(`Error: ${error}`);
        }
        console.log(`A new user is added: ${username}`);
        return;
    }

    console.log("User is already in the db");
    try {
        res.redirect('/auth/login');
    } catch (error) {
        console.error(`Error: ${error}`);
    }

    return;
};

module.exports = { getUserByName, createUser };