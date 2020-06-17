// verify the jwt token passed within the request
function verifyToken(request, response, next) {
    // create bearer from authorization header
    const bearerHeader = request.headers['authorization'];
    // check if authorization is not undefined
    if (typeof bearerHeader !== 'undefined') {
        // split 'bearer <token>
        const bearer = bearerHeader.split(' ');
        // get only the token
        const bearerToken = bearer[1];
        // set request.token as token from header
        request.token = bearerToken;
        // continue
        next()
    } else {
        // return 401 and error message of token is invalid
        response.status(401).send("Unauthorized, Token is invalid")
    }
}


module.exports = {
    verifyToken
};