const express = require("express");
const shoppingCartItemLogic = require("../business-logic/shopping-cart-item-logic");
const shoppingCartLogic = require("../business-logic/shopping-cart-logic");
const router = express.Router();
const config = require("../config");
const jwtVerifier = require("../middleware/jwt-verify");
const jwt = require("jsonwebtoken");



// post api/cart/actions/ (adding new item to cart)
router.post("/add/", jwtVerifier.verifyToken, (request, response) => {
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
                if(!newCartItem.productId || !newCartItem.cartId || !newCartItem.quantity || !newCartItem.totalPrice || newCartItem.quantity < 0 || newCartItem.totalPrice < 0) {
                    response.status(500).send("Data can't be Empty or Bellow 0");
                    return;
                }
                // making sure it's being added to the correct cart
                let cart = await shoppingCartLogic.getShoppingCartAsync(authData.user.uuid)
                cart = JSON.stringify(cart);
                cart = JSON.parse(cart);
                newCartItem.cartId = cart.id
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
router.delete("/remove/:_productId", jwtVerifier.verifyToken, (request, response) => {
    // verify token, if exists and valid continues to promise, if invalid will give out error of invalid   
    jwt.verify(request.token, config.jwt.secretKey, async (err, authData) => {
        if (err) {
             // return 401 and response from jwt function
             response.status(401).send(err.message)
        }
        else {
            try {
                // get id param from request
                const productId = +request.params._productId;
                // taking cart id from the jwt so I will not be able to delete someone's else cart and only on his own active cart
                let cart = await shoppingCartLogic.getShoppingCartAsync(authData.user.uuid)
                cart = JSON.stringify(cart);
                cart = JSON.parse(cart);
                // send delete request to the data source based on id
                const productIdRemoved = await shoppingCartItemLogic.removeItemFromCartAsync(cart.id, productId);
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
router.delete("/empty/:_cartId", jwtVerifier.verifyToken, (request, response) => {
    // verify token, if exists and valid continues to promise, if invalid will give out error of invalid   
    jwt.verify(request.token, config.jwt.secretKey, async (err, authData) => {
        if (err) {
             // return 401 and response from jwt function
             response.status(401).send(err.message)
        }
        else {
            try {
                // get cartId param from request
                const cartId = +request.params._cartId;
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