
const express = require("express");
const shopCategories = require("../business-logic/categories-logic");
const router = express.Router();
const config = require("../config");
const jwtVerifier = require("../middleware/jwt-verify");
const jwt = require("jsonwebtoken");

// GET api/shop/categories/ (Also creates new Cart if there is no existing one)
router.get("/", jwtVerifier.verifyToken, (request, response) => {
    // verify token, if exists and valid continues to promise, if invalid will give out error of invalid
    jwt.verify(request.token, config.jwt.secretKey, async (err, authData) => {
        // check if error returns from jwt validation
        if (err) {
            // return 401 and response from jwt function
            response.status(401).send(err.message)
        }
        else {
            try {
                // call to shopCategories and retrieve all categories
                const categories = await shopCategories.getCategoriesAsync();
                response.json(categories);
                return;
            }
            catch (err) {
                // return 500 if error occurs while attempt to get products from data source
                response.status(500).send(err.message);
            }
        }
    })
});

module.exports = router;
