
const express = require("express");
const ordersLogic = require("../business-logic/orders-logic");
const shoppingCartLogic = require("../business-logic/shopping-cart-logic")
const router = express.Router();
const uuid = require("uuid");
const jwt = require("jsonwebtoken");
const config = require("../config");
const jwtVerifier = require("../middleware/jwt-verify")


// POST api/orders/new
router.post("/new", jwtVerifier.verifyToken, (request, response) => {
    // verify token, if exists and valid continues to promise, if invalid will give out error of invalid
    jwt.verify(request.token, config.jwt.secretKey, async (err, authData) => {
        if (err) {
            // returned error based on auth problem token or permissions
            response.status(401).send(err.message);
            return;
        }
        else {
            try {
                // get order from request body
                const order = request.body;
                const creationDate = new Date();
                order.creationDate = creationDate;
                // return and exit if request is empty
                if (!order.userId || !order.cartId || !order.totalPrice || !order.city || !order.address || !order.creationDate || !order.deliveryDate || !order.lastCC) {
                    response.status(500).send("Data can't be Empty or Bellow 0");
                    return;
                }
                // return and exit delivery date < now
                if (!order.creationDate || !order.deliveryDate) {
                    response.status(500).send("Dates can't be empty");
                    return;
                }
                order.deliveryDate = new Date(order.deliveryDate)
                // check and validate there are no more orders on same date
                const ordersCountOnSameDay = await ordersLogic.countDeliveryDayOrders(order.deliveryDate);
                if ( ordersCountOnSameDay.TotalOrdersScheduled >= 3) {
                    response.status(500).send({reason: "Day is not Available, Please choose different day", taken: 1});
                    return;
                }
                // send order to be added in the data source
                const addedOrder = await ordersLogic.addOrderAsync(order);
                if (addedOrder) {
                    const closedCart = await shoppingCartLogic.closeCartAsync(order.cartId);
                    if(closedCart) {
                        response.status(201).json(addedOrder);
                        return;
                    }
                }
            }
            catch (err) {
                // return 500 if error occurs while attempt to get products from data source
                response.status(500).send("Please try again later or contact site Admin");
            }
        }
    })
});

module.exports = router;
