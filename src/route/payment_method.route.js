


const { userGuard } = require("../controller/auth.controller")
const pay = require("../controller/payment_method.controller")
const payment_method = (app)=>{
    var base_url = "/api/payment_method"
    app.get(base_url,userGuard,pay.getList)
    app.post(base_url,pay.create)
    app.delete(base_url,pay.remove)
}
module.exports=payment_method