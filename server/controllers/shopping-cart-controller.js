
const express = require("express");
const shoppingCartLogic = require("../business-logic/shopping-cart-logic");
const router = express.Router();
const config = require("../config");
const jwtVerifier = require("../middleware/jwt-verify");
const jwt = require("jsonwebtoken");

// GET api/cart/information/:uuid (Also creates new Cart if there is no existing one)
router.get("/:_uuid", jwtVerifier.verifyToken, (request, response) => {
    // verify token, if exists and valid continues to promise, if invalid will give out error of invalid
    jwt.verify(request.token, config.jwt.secretKey, async (err, authData) => {
        // check if error returns from jwt validation
        if (err) {
            // return 401 and response from jwt function
            response.status(401).send(err.message)
        }
        else {
            try {
                // get id param from request
                const uuid = request.params._uuid;
                // call to shoppingCartLogic and retrieve single active cart based on uuid
                const cart = await shoppingCartLogic.getShoppingCartAsync(uuid);
                // if cart doesn't exist, create new one
                if (cart === undefined) {
                    const newCart = await shoppingCartLogic.addCartAsync(uuid);
                    response.json(newCart);
                }
                // returns cart if exists
                else if(cart !== undefined){
                response.json(cart);
                }
            }
            catch (err) {
                // return 500 if error occurs while attempt to get products from data source
                response.status(500).send(err.message);
            }
        }
    })
});

// GET api/cart/information/items/:id (Also creates new Cart if there is no existing one)
router.get("/items/:_id", jwtVerifier.verifyToken, (request, response) => {
    // verify token, if exists and valid continues to promise, if invalid will give out error of invalid
    jwt.verify(request.token, config.jwt.secretKey, async (err, authData) => {
        // check if error returns from jwt validation
        if (err) {
            // return 401 and response from jwt function
            response.status(401).send(err.message)
        }
        else {
            try {
                // get id param from request
                const id = +request.params._id;
                // call to shoppingCartLogic and retrieve single active cart based on uuid
                const cartItems = await shoppingCartLogic.getShoppingCartItemsAsync(id);
                // return cart items
                response.json(cartItems);

            }
            catch (err) {
                // return 500 if error occurs while attempt to get products from data source
                response.status(500).send(err.message);
            }
        }
    })
});


module.exports = router;
