
const express = require("express");
const productsLogic = require("../business-logic/products-logic");
const router = express.Router();
const uuid = require("uuid");
const jwt = require("jsonwebtoken");
const config = require("../config");
const jwtVerifier = require("../middleware/jwt-verify");
const fieldValidator = require("../helpers/field-validator");

// GET api/products/
router.get("/", jwtVerifier.verifyToken, (request, response) => {
    // verify token, if exists and valid continues to promise, if invalid will give out error of invalid
    jwt.verify(request.token, config.jwt.secretKey, async (err, authData) => {
        // check if error returns from jwt validation
        if (err) {
            // return 401 and response from jwt function
            response.status(401).send(err.message)
        }
        else {
            // call to productsLogic and retrieve all products
            try {
                // create object with all products that are returned from data source
                const products = await productsLogic.getAllProductsAsync();
                // return all products back
                response.json(products);
            }
            catch (err) {
                // return 500 if error occurs while attempt to get products from data source
                response.status(500).send(err.message);
            }
        }
    })
});

// GET api/products/:id
router.get("/:_id", jwtVerifier.verifyToken, (request, response) => {
    // verify token, if exists and valid continues to promise, if invalid will give out error of invalid
    jwt.verify(request.token, config.jwt.secretKey, async (err, authData) => {
        // adding another securit inside of the server to overcome changes inside of the angular application so that only admin can do changes
        // check if error returns from jwt validation
        if (err || authData.user.isAdmin !== 1) {
            // return 401 and response from jwt function
            response.status(401).send(err.message)
        }
        else {
            try {
                // get id param from request
                const id = +request.params._id;
                // call to productsLogic and retrieve single product based on id
                const product = await productsLogic.getOneProductAsync(id);
                // if products doesn't exit on specific id, return 404
                if (!product) {
                    response.sendStatus(404).send("productId not found");
                    return;
                }
                // return product
                response.json(product);
            }
            catch (err) {
                // return 500 if error occurs while attempt to get products from data source
                response.status(500).send(err.message);
            }
        }
    })
});

// POST api/products
router.post("/", jwtVerifier.verifyToken, (request, response) => {
    // verify token, if exists and valid continues to promise, if invalid will give out error of invalid
    jwt.verify(request.token, config.jwt.secretKey, async (err, authData) => {
        // adding another security inside of the server to overcome changes inside of the angular application so that only admin can do changes
        if (err || authData.user.isAdmin !== 1) {
            // returned error based on auth problem token or permissions
            (err) ? response.status(401).send(err.message) : response.status(401).send("Not Authorized, Insufficient permissions")
        }
        else {
            try {
                // get product from request body
                const product = request.body;
                // return and exist if request is empty
                if (!product.productName || +product.productPrice < 0) {
                    response.status(500).send("Data can't be Empty or Bellow 0");
                }
                if (!fieldValidator.validateProductName(product.productName)) {
                    response.status(500).send("Name should be 3-40 characters long");
                }
                if (!fieldValidator.validateProductPrice(product.productPrice)) {
                    response.status(500).send("Price should be between 0 - 10000");
                }
                if (!request.files.productImage) {
                    response.status(500).send("Missing File");
                }
                // create separate file object
                const uploadFile = request.files.productImage;
                // get file extension
                const extension = uploadFile.name.substr(uploadFile.name.lastIndexOf("."));
                // generate new name for file with correct extension
                const fileName = uuid.v4() + extension;
                // push file into upload folder under new name
                uploadFile.mv("./uploads/products/" + fileName);
                // send product with new file name to be added in the data source
                const addedProduct = await productsLogic.addProductAsync(product, fileName);
                // const addedProduct = await productsLogic.addProductAsync(product);
                // return 201 and the added product response
                response.status(201).json(addedProduct);
            }
            catch (err) {
                // return 500 if error occurs while attempt to get products from data source
                response.status(500).send(err.message);
            }
        }
    })
});

// PUT api/products/:id
router.put("/:id", jwtVerifier.verifyToken, (request, response) => {
    // verify token, if exists and valid continues to promise, if invalid will give out error of invalid
    jwt.verify(request.token, config.jwt.secretKey, async (err, authData) => {
        // adding another security inside of the server to overcome changes inside of the angular application so that only admin can do changes
        if (err || authData.user.isAdmin !== 1) {
            // returned error based on auth problem token or permissions
            (err) ? response.status(401).send(err.message) : response.status(401).send("Not Authorized, Insufficient permissions");
            return;
        }
        else {
            try {
                // get product from request body
                const product = request.body;
                if (!product.productName.length || !product.productPrice || +product.productPrice < 0) {
                    response.status(500).send("Data can't be Empty or Bellow 0");
                }
                if (product.productName && !fieldValidator.validateProductName(product.productName)) {
                    response.status(500).send("Name should be 3-40 characters long");
                }
                if (product.productPrice && !fieldValidator.validateProductPrice(product.productPrice)) {
                    response.status(500).send("Price should be between 0 - 10000");
                }
                // const filename in case none is being passed to pass empty string
                const fileName = ''
                if (request.files) {
                    console.log("got here")
                    // create separate file object
                    const uploadFile = request.files.productImage;
                    // get file extension
                    const extension = uploadFile.name.substr(uploadFile.name.lastIndexOf("."));
                    // generate new name for file with correct extension
                    fileName = uuid.v4() + extension;
                    // push file into upload folder under new name
                    uploadFile.mv("./uploads/products/" + fileName);
                }
                // send product with new file name to be added in the data source
                const updatedProduct = await productsLogic.updatePartialProductAsync(product, fileName);
                // const addedProduct = await productsLogic.addProductAsync(product);
                // return 201 and the added product response
                response.status(201).json(updatedProduct);
                return;
            }
            catch (err) {
                console.log(err);
                // return 500 if error occurs while attempt to get products from data source
                response.status(500).send(err.message);
            }
        }
    })
});



module.exports = router;
