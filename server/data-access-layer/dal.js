const mysql = require("mysql");

// mysql config
const connection = mysql.createConnection({
    host: config.mysqlConfig.host,
    user: config.mysqlConfig.user,
    password: config.mysqlConfig.password,
    database: config.mysqlConfig.database
});

// connect to DB, return error if fails
connection.connect(err => {
    if (err) {
        console.error(err);
        return;
    }
    console.log("We're connected to Online Store Database on MySQL.");
});

// execute sql query with the passed values
function executeAsync(sql, values) {
    return new Promise((resolve, reject) => {
        // pass sql query and values that need to be set inside of the query
        connection.query(sql, values, (err, result) => {
            if (err) {
                // reject if error
                reject(err);
                return;
            }
            // return result
            resolve(result);
        });
    });
}

module.exports = {
    executeAsync
};