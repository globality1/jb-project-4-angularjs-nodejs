
// check if name is in correct range
function validateProductName(name) {
   if(name.length < 5 || name.length > 40) {
       return false;
   }
   return true;
}

// check if price is in correct value
function validateProductPrice(price) {
    if(price < 0 || name.length > 10000) {
        return false;
    }
    return true;
}


module.exports = {
    validateProductName,
    validateProductPrice
}