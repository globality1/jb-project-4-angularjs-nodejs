const dal = require("../data-access-layer/dal");

//

// create new shopping cart item
async function addItemToCartAsync(newItem) {
    const sql = "INSERT INTO shopping_cart_items VALUES(DEFAULT, ?, ?, ?, ?)";
    const info = await dal.executeAsync(sql, [newItem.productId, newItem.cartId, newItem.quantity, newItem.totalPrice]);
    newItem.id = info.insertId;
    return newItem;
};

// remove shopping cart item
async function removeItemToCartAsync(id) {
    const sql = "DELETE FROM shopping_cart_items WHERE id = ? ";
    await dal.executeAsync(sql, [id]);
    return id;
};

// remove all shopping cart item
async function removeAllItemFromCartAsync(cartId) {
    const sql = "DELETE FROM shopping_cart_items WHERE shopping_cart_id = ? ";
    await dal.executeAsync(sql, [cartId]);
    return cartId;
};


module.exports = {
    addItemToCartAsync,
    removeAllItemFromCartAsync,
    removeItemToCartAsync
};