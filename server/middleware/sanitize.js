const stripTags = require("striptags");

// converts everything to string for more secure queries
function sanitize(request, response, next) {
    for(const property in request.body) {
        if(typeof request.body[property] === "string") {
            request.body[property] = stripTags(request.body[property]);
        }
    }
    next();
}

module.exports = sanitize;