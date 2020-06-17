const dal = require("../data-access-layer/dal");


// create new order
async function addOrderAsync(order) {
    const sql = "INSERT INTO completed_orders VALUES(DEFAULT, ?, ?, ?, ?, ?, ?, ?, ?)";
    const newOrder = await dal.executeAsync(sql,[order.userId,order.cartId, order.totalPrice, order.city, order.address, order.creationDate, order.deliveryDate, order.lastCC]);
    order.id = newOrder.insertId;
    return order;
}

// check how many orders are for that day
async function countDeliveryDayOrders(dateToCheck) {
    const sql = "SELECT Count(*) as TotalOrdersScheduled FROM completed_orders WHERE DATE_FORMAT(order_delivery_date, '%Y-%m-%d') = DATE_FORMAT(?, '%Y-%m-%d')";
    const orderSameDay = await dal.executeAsync(sql, [dateToCheck]);
    return orderSameDay[0];
}

module.exports = {
    addOrderAsync,
    countDeliveryDayOrders
};