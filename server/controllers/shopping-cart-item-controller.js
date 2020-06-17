const express = require("express");
const shoppingCartItemLogic = require("../business-logic/shopping-cart-item-logic");
const router = express.Router();
const config = require("../config");
const jwtVerifier = require("../middleware/jwt-verify");
const jwt = require("jsonwebtoken");



// post api/cart/actions/ (adding new item to cart)
router.post("/", jwtVerifier.verifyToken, (request, response) => {
    // verify token, if exists and valid continues to promise, if invalid will give out error of invalid
    jwt.verify(request.token, config.jwt.secretKey, async (err, authData) => {
        // check if error returns from jwt validation
        if (err) {
            // return 401 and response from jwt function
            response.status(401).send(err.message);
        }
        else {
            try {
                // get id param from request
                const newCartItem = request.body;
                // call to shoppingCartLogic and retrieve single active cart based on uuid
                const addNewCartItem = await shoppingCartItemLogic.addItemToCartAsync(newCartItem);
                // if cart doesn't exist, create new one
                response.status(201).json(addNewCartItem);
            }
            catch (err) {
                // return 500 if error occurs while attempt to get products from data source
                response.status(500).send(err.message);
            }
        }
    })
});


// remove specfic item from cart by the item id in cart data source
// delete api/cart/actions/:id
router.delete("/:id", jwtVerifier.verifyToken, (request, response) => {
    // verify token, if exists and valid continues to promise, if invalid will give out error of invalid   
    jwt.verify(request.token, config.jwt.secretKey, async (err, authData) => {
        if (err) {
             // return 401 and response from jwt function
             response.status(401).send(err.message)
        }
        else {
            try {
                // get id param from request
                const id = +request.params.id;
                // send delete request to the data source based on id
                await shoppingCartItemLogic.removeItemToCartAsync(id);
                // return 204 on deletion
                response.sendStatus(204);
            }
            catch (err) {
                // return 500 if error occurs while attempt to get products from data source
                response.status(500).send(err.message);
            }
        }
    })
});


// deletes all items in cart for 
// delete api/cart/actions/empty/:cartId
router.delete("/empty/:cartId", jwtVerifier.verifyToken, (request, response) => {
    // verify token, if exists and valid continues to promise, if invalid will give out error of invalid   
    jwt.verify(request.token, config.jwt.secretKey, async (err, authData) => {
        if (err) {
             // return 401 and response from jwt function
             response.status(401).send(err.message)
        }
        else {
            try {
                // get cartId param from request
                const cartId = +request.params.cartId;
                // send delete request to the data source based on id
                await shoppingCartItemLogic.removeAllItemFromCartAsync(cartId);
                // return 204 on deletion
                response.sendStatus(204);
            }
            catch (err) {
                // return 500 if error occurs while attempt to get products from data source
                response.status(500).send(err.message);
            }
        }
    })
});

module.exports = router;