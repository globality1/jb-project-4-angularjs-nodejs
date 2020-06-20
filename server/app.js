global.config = require("./config");
const express = require("express");
const sanitize = require("./middleware/sanitize");
const authController = require("./controllers/auth-controller");
const productsController = require("./controllers/products-controller");
const usersController = require("./controllers/users-controller");
const productsLogic = require("./business-logic/products-logic");
const imagesDisplayController = require("./controllers/images-display-controller");
const shoppingCartController = require("./controllers/shopping-cart-controller");
const shoppingCartItemController = require("./controllers/shopping-cart-item-controller");
const categoriesController = require("./controllers/categories-controller");
const homePageInformationController = require("./controllers/home-page-information-controller");
const ordersController = require("./controllers/orders-controller");
const fileUpload = require("express-fileupload");
const fs = require("fs");
const cors = require("cors");
const io = require("socket.io");
const bodyParser = require("body-parser")

const server = express();

// open all incoming requests from port 3001
server.use(cors({ origin: "http://localhost:4200", credentials: true }));
// giving higher limit for files
server.use(express.json({limit: '50mb'}));
server.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
server.use(fileUpload());

// removes any tags from any values that goes into the system
server.use(sanitize);

// create a folder for uploads if doesn't already exist
if (!fs.existsSync(__dirname + "/uploads/products")) {
    fs.mkdirSync(__dirname + "/uploads/products");
}


server.use("/api/auth", authController);
server.use("/api/users", usersController);
server.use("/api/products", productsController);
server.use("/api/images", imagesDisplayController);
server.use("/api/cart/information", shoppingCartController);
server.use("/api/cart/actions", shoppingCartItemController);
server.use("/api/shop/categories", categoriesController);
server.use("/api/shopGeneralInformation", homePageInformationController);
server.use("/api/orders", ordersController);


// listen to server on port 3000 and create socket
const expressListener = server.listen(3000, () => {
    console.log("Listening on http://localhost:3000")
});

// create socket 
const socketServer = io(expressListener);

// use the socket on the root files
server.use(express.static(__dirname));

// actions the socket does when received on server
socketServer.sockets.on("connection", socket => {
    
    // action to be done upon update from admin
    socket.on("update-from-app", async message => {
        const products = await productsLogic.getAllProductsAsync();
        socketServer.sockets.emit("update-from-server", products)
    })
    // action to be done upon login from app
    socket.on("login-from-app", async message => {
        const products = await productsLogic.getAllProductsAsync();
        socketServer.sockets.emit("update-from-server", products)
    })

    // output in server when client disconnects
    socket.on("disconnect", () => {
        socket.disconnect();
    })

})