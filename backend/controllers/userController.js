const UserService = require("../services/UserService");

async function getUserByName(req, res) {
    const { username } = req.params;

    const user = await db.getUserByName(username);

        // Call view for profile of user
        res.status(200).json(user);

    } catch (error) {

        // Call view for error finding user
        res.status(404).json({ message: error.message });
    }
}

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

        // Call view for error finding user
        res.status(404).json({ message: error.message });
    }
}

// async function createUser(req, res) {

//     if (!user) {
//         // append to the db
//         await db.createUser(username);
//         // redirect to profile page
//         try {
//             res.redirect(`/profile/${username}`);
//         } catch (error) {
//             console.error(`Error: ${error}`);
//         }
//         console.log(`A new user is added: ${username}`);
//         return;
//     }

//     console.log("User is already in the db");
//     try {
//         res.redirect('/auth/login');
//     } catch (error) {
//         console.error(`Error: ${error}`);
//     }

//     return;
// };

module.exports = { getUserByName, createUser };
module.exports = { getUserByName, createUser};
