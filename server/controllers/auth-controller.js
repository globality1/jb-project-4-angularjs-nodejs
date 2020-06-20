const express = require("express");
const authLogic = require("../business-logic/auth-logic");
const router = express.Router();
const jwt = require("jsonwebtoken");
const jwtVerifier = require("../middleware/jwt-verify");

// POST api/login
router.post("/login", async (request, response) => {
    try {
        const { email, password } = request.body;
        const result = await authLogic.validateUserAsync(email, password);
        (result.success) ? response.json(result.user) : response.status(403).send(result.message);

    }
    catch (err) {
        response.status(500).send(err.message);
    }
});

// POST api/relogin
router.post("/relogin", jwtVerifier.verifyToken, (request, response) => {
    // verify token, if exists and valid continues to promise, if invalid will give out error of invalid
    jwt.verify(request.token, config.jwt.secretKey, (err, authData) => {
        // adding another security inside of the server to overcome changes inside of the angular application so that only admin can do changes
        if (err) {
            // returned error based on auth problem token or permissions
            (err) ? response.status(401).send(err.message) : response.status(401).send("Invalid Token")
        }
        else {
            authData.user.token = request.token;
            response.send(authData.user);
        }
    })
});

module.exports = router;