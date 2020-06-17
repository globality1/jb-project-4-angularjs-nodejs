const dal = require("../data-access-layer/dal");

// get all Items from cart
async function getCategoriesAsync() {
    const sql = "SELECT id as categoryId, category_name as categoryName FROM product_category ";
    const cartItems = await dal.executeAsync(sql);
    return cartItems;
}


module.exports = {
    getCategoriesAsync
};