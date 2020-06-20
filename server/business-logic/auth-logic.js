const dal = require("../data-access-layer/dal");
const config = require("../config");
const jwt = require("jsonwebtoken");
const cryptography = require("../helpers/cryptography");


// first validation in the process
async function validateUserAsync(email, password) {
    // check if username or password are empty
    if (!email || !password) {
        return {
            success: false,
            message: "Missing Email/Password"
        }
    }
    const user = { email, password };
    // go to validateUserFully
    const validationResponse = await validateUserFullyAsync(user)
    // return success response
    return validationResponse;
}

// second validation in the process
async function validateUserFullyAsync(user) {
    // hash password to fit same one as in data source
    user.password = cryptography.hash(user.password);
    // check mysql if email exists
    const sql = "Select uuid as uuid, first_name as firstName, last_name as lastName, email as email, personal_id as personalId, isAdmin as isAdmin, city as city, address as address FROM users WHERE email = ? AND password = ?";
    // reconstruct the results so it will return single and correct user object
    const result = await dal.executeAsync(sql, [user.email, user.password]);
    if (!result.length) {
        return {
            success: false,
            message: "Incorrect Email/Password"
        }
    }
    // const user as object
    const users = result.map(n => Object.assign({}, n));
    // get first user as each user is unique
    user = users[0]
    // return successful response
    return generateToken(user);
}


// token generation - giving it 12h lifetime
function generateToken(user) {
    const token = jwt.sign({ user }, config.jwt.secretKey, {
        expiresIn: '12h'
    });
    user.token = token;
    return {
        success: true,
        message: 'Authentication successful!',
        user
    }
}



module.exports = {
    validateUserAsync
}