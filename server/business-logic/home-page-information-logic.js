const dal = require("../data-access-layer/dal");

// get all Items from cart
async function getCountOfProductsAsync() {
    const sql = "SELECT count(*) as TotalProducts FROM products ";
    const productsCount = await dal.executeAsync(sql);
    return productsCount[0].TotalProducts;
}

async function getCountOfOrdersAsync() {
    const sql = "SELECT count(*) as TotalOrders FROM completed_orders ";
    const ordersCount = await dal.executeAsync(sql);
    return ordersCount[0].TotalOrders;
}

module.exports = {
    getCountOfProductsAsync,
    getCountOfOrdersAsync
};