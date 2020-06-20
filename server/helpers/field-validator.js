
// check if name is in correct range
function validateProductName(name) {
   if(name.length > 5 || name.length < 40) {
       return true;
   }
   return false;
}

// check if price is in correct value
function validateProductPrice(price) {
    if(price > 0 || price < 10000) {
        return true;
    }
    return false;
}


module.exports = {
    validateProductName,
    validateProductPrice
}