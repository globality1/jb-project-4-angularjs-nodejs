const express = require("express");
const usersLogic = require("../business-logic/users-logic");
const cryptography = require("../helpers/cryptography");
const router = express.Router();


// GET api/users/:id
router.get("/:uuid", async (request, response) => {
    try {
        // get id fro the request, make sure it's number
        const id = +request.params.uuid;
        // send user request
        const user = await usersLogic.getOneUserAsync(id);
        // check if user returned, if no, return 404
        if (!user) {
            response.sendStatus(404);
            return;
        }
        // return user
        response.json(user);
    }
    catch (err) {
        response.status(500).send(err.message);
    }
});

// POST api/users
router.post("/", async (request, response) => {
    // create user from request body
    const user = request.body;
    // check all values are not empty - not creating here all validations for email , full rgex password and name as it's in the client as well
    if (!user.email || !user.password || !user.city || !user.address || !user.firstName || !user.lastName || !user.personalId) {
        const message = {
            success: false,
            message: "Missing Parameters, please check your data",
        };
        response.status(403).send(message);
        return
    }
    if (user.password.length < 8) {
        const message = {
            success: false,
            message: "Password should be min 8 characters long",
        };
        response.status(403).send(message);
        return
    }
    try {
        // has user password for data source
        user.password = cryptography.hash(user.password);
        // send user creation request
        const addedUser = await usersLogic.addUserAsync(user);
        (addedUser.success) ? response.status(201).json(addedUser.user) : response.status(403).send(addedUser.message);
    }
    catch (err) {
        response.status(500).send(err.message);
    }
});


module.exports = router;
