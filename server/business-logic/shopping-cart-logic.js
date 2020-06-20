const dal = require("../data-access-layer/dal");

// add shopping cart
async function addCartAsync(uuid) {
    const dateTime = new Date();
    const sql = "INSERT INTO shopping_cart VALUES(DEFAULT, ?, ?, 1)";
    const info = await dal.executeAsync(sql, [uuid, dateTime]);
    if (info) {
        const newShoppingCart = await getShoppingCartAsync(uuid);
        return newShoppingCart;
    }
    return;
};

// get cart by uuid 
async function getShoppingCartAsync(uuid) {
    const sql = "SELECT id as id, creation_date as creationDate FROM shopping_cart WHERE active = 1 and user_id = ?";
    const cart = await dal.executeAsync(sql, [uuid]);
    return cart[0];
}

// get all Items from cart
async function getShoppingCartItemsAsync(id) {
    const sql = "SELECT p.product_name as productName, sci.product_id as productId, SUM(sci.quantity) as quantity, SUM(sci.total_price) as totalPrice, p.product_image as productImageName FROM shopping_cart_items sci LEFT JOIN products p ON p.id = sci.product_id WHERE shopping_cart_id = ? group by sci.product_id";
    const cartItems = await dal.executeAsync(sql, [id]);
    return cartItems;
}



// close cart by id
async function closeCartAsync(id) {
    const sql = "UPDATE shopping_cart SET active = 0 WHERE id = ? ";
    await dal.executeAsync(sql, [id]);
    return id;
}

module.exports = {
    addCartAsync,
    getShoppingCartAsync,
    getShoppingCartItemsAsync,
    closeCartAsync
};