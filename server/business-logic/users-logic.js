const dal = require("../data-access-layer/dal");
const uuid = require("uuid");

// get all users from data source
async function getAllUsersAsync() {
    const sql = `Select 
                    uuid as uuid, 
                    first_name as firstName, 
                    last_name as lastName, 
                    email as email, 
                    personal_id as personalId, 
                    isAdmin as isAdmin, 
                    city as city, 
                    address as address 
                FROM users`;
    const users = await dal.executeAsync(sql);
    return users;
};

// get one user by id from data source
async function getOneUserAsync(uuid) {
    const sql = "Select uuid as uuid, first_name as firstName, last_name as lastName, email as email, personal_id as personalId, isAdmin as isAdmin, city as city, address as address FROM users WHERE uuid = ?";
    const users = await dal.executeAsync(sql,[uuid]);
    return users[0];
}

// add new user to data source
async function addUserAsync(user) {
    // check if email already exists in DB
    console.log(user);
    const emailCheck = await checkIfEmailExist(user.email);
    const personalIdCheck = await checkIfPersonalIdExist(user.personalId) 
    user.uuid = uuid.v4();
    // if returned success, email does not exist, continue to creation
    if (emailCheck.success === true && personalIdCheck.success === true ) {
        const sql = "INSERT INTO users(uuid, first_name, last_name, email, personal_id, password, city, address, isAdmin) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)";
        const info = await dal.executeAsync(sql,[user.uuid, user.firstName, user.lastName, user.email, user.personalId, user.password, user.city, user.address,0]);
        user.id = info.insertId;
        return {
            success: true,
            user: user
        };
    }
    // return response otherwise
    console.log("here")
    return emailCheck ? {message: personalIdCheck} : { message: emailCheck };
}

// check if email exists
async function checkIfEmailExist(email) {
    const sql = "SELECT * FROM users WHERE email = ? ";
    const result = await dal.executeAsync(sql, [email]);
    if (result.length) {
        return {
            success: false,
            email: true,
            message: "Email Already Exist",
        }
    }
    return {
        success: true
    }
}

// check if personalId exists
async function checkIfPersonalIdExist(personalId) {
    const sql = "SELECT * FROM users WHERE personal_id = ? ";
    const result = await dal.executeAsync(sql, [personalId]);
    if (result.length) {
        return {
            success: false,
            personalId: true,
            message: "Personal ID Already Exist",
        }
    }
    return {
        success: true
    }
}

// delete user by id from data source
async function deleteUserAsync(uuid) {
    const sql = "DELETE FROM users WHERE userId = ? ";
    await dal.executeAsync(sql,[uuid]);
    return id;
}

module.exports = {
    getAllUsersAsync,
    getOneUserAsync,
    addUserAsync,
    deleteUserAsync
};