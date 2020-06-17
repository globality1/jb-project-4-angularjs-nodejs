const config = require("../config");
const crypto = require("crypto");

// Hash password:
function hash(password) {
    // Hash with secret: 
    return crypto.createHmac("sha512", config.hash.secretKey).update(password).digest("hex");
}

module.exports = {
    hash
}