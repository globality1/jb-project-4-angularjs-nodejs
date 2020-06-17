const express = require("express");
const authLogic = require("../business-logic/auth-logic");
const router = express.Router();


router.post("/login", async (request, response) => {
    try {
        const { email, password } = request.body;
        const result = await authLogic.validateUserAsync(email, password);
        if (result.success) {
            request.session.token = result.token;
            request.session.isLoggedIn = true;
            request.session.userRole = result.userRole; 
        }
        (result.success) ? response.json(result.user) : response.status(403).send(result.message);

    }
    catch (err) {
        response.status(500).send(err.message);
    }
});

router.post("/logout", async (request, response) => {
    // authLogic.destroyToken(request.session.token);
    request.session.destroy();
    response.send("Logout successfully");
});


module.exports = router;