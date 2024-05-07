
const ct = require("../controller/cart.controller")

const cart = (app) =>{
    var base_url = "/api/cart"
    app.get(`${base_url}`,ct.getCartBycustomer)
    app.post(`${base_url}`,ct.addCart)
    app.delete(`${base_url}`,ct.removeCart)
    app.put(`${base_url}`,ct.updateCart)
}
module.exports=cart