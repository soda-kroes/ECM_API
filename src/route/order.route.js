

const { userGuard } = require("../controller/auth.controller")
const ord = require("../controller/order.controller")

const order = (app) =>{
    var base_url = "/api/order"
    app.get(`${base_url}`,userGuard,ord.getList)
    app.get(`${base_url}/:id`,ord.getOne)
    app.post(`${base_url}`,ord.create)
    app.put(`${base_url}`,ord.update)
    app.delete(`${base_url}`,ord.remove)
}
module.exports=order


