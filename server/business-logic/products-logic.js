const dal = require("../data-access-layer/dal");

// get all products single product
async function getAllProductsAsync() {
    const sql = `SELECT 
                    id as id, 
                    product_name as productName, 
                    product_category_id as productCategoryId, 
                    product_price as productPrice, 
                    product_image as productImageName 
                FROM products`;
    const products = await dal.executeAsync(sql);
    return products;
}

// get one single product
async function getOneProductAsync(id) {
    const sql = "SELECT id as id, product_name as productName, product_category_id as productCategoryId, product_price as productPrice, product_image as productImageName  FROM products WHERE id = ?";
    const products = await dal.executeAsync(sql, [id]);
    return products[0];
}

// create new product
async function addProductAsync(product, fileName) {
    const sql = "INSERT INTO products VALUES(DEFAULT, ?, ?, ?, ?)";
    const info = await dal.executeAsync(sql, [product.productName, product.productCategoryId, product.productPrice, fileName]);
    product.id = info.insertId;
    return product;
}


async function updatePartialProductAsync(product, fileName) {

    let sql = "UPDATE products SET ";

    if (product.productName.length > 0) {
        sql += `product_name = '${product.productName}',`
    }
    if (product.productCategoryId.length > 0) {
        sql += ` product_category_id = '${product.productCategoryId}',`
    }
    if (product.productPrice.length > 0) {
        sql += `product_price = '${product.productPrice}',`
    }
    if (fileName.length > 0) {
        sql += `product_image = '${fileName}',`
    }

// Delete last comma from string: 
sql = sql.substr(0, sql.length - 1);

sql += ` WHERE id = '${product.productId}'`;

const info = await dal.executeAsync(sql);

return info.affectedRows === 0 ? null : product;
}


module.exports = {
    getAllProductsAsync,
    getOneProductAsync,
    addProductAsync,
    updatePartialProductAsync
};