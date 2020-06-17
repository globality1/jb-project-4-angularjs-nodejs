const express = require("express");
const homePageInformationLogic = require("../business-logic/home-page-information-logic");
const router = express.Router();


// GET api/shopGeneralInformation/products
router.get("/products", async (request, response) => {
    try {
        const countOfProducts = await homePageInformationLogic.getCountOfProductsAsync();
        response.json(countOfProducts);
    }
    catch (err) {
        response.status(500).send(err.message);
    }
});

// GET api/shopGeneralInformation/orders
router.get("/orders", async (request, response) => {
    try {
        const countOfOrders = await homePageInformationLogic.getCountOfOrdersAsync();
        response.json(countOfOrders);
    }
    catch (err) {
        response.status(500).send(err.message);
    }
});



module.exports = router;