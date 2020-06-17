const express = require("express");
const router = express.Router();

// GET /api/images/products/:name
router.get("/products/:imgName", async (request, response) => {
    try {
        response.sendFile(request.params.imgName,  { root: "./uploads/products" });
    }
    catch (err) {
        response.status(500).send(err.message);
    }
});

// GET /api/images/main/:name
router.get("/main/:imgName", async (request, response) => {
    try {
        response.sendFile(request.params.imgName,  { root: "./uploads/main" });
    }
    catch (err) {
        response.status(500).send(err.message);
    }
});


module.exports = router;