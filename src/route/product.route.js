

const pro = require('../controller/product.controller')
const { userGuard} = require("../controller/auth.controller")

const product = (app) =>{
    var base_url = "/api/product"
    app.get(base_url,pro.getList)
    app.get(base_url+"/:id",pro.getOne)
    app.post(base_url,userGuard(),pro.create)
    app.put(base_url,userGuard(),pro.update)
    app.delete(base_url,userGuard(),pro.remove)
    app.post(base_url+"change_status",pro.change_product_status)
}
module.exports = product