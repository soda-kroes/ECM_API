
const { userGuard } = require("../controller/auth.controller")
const cus = require("../controller/customer.controller")

const customer = (app) => {
    var base_url = "/api/customer"
    app.get(base_url,userGuard(),cus.getList)
    app.get(base_url+"/:id",userGuard(),cus.getOne)
    app.post(base_url,userGuard("customer.Create"),cus.create)
    app.put(base_url,userGuard("customer.Update"),cus.update)
    app.delete(base_url+"/:id",userGuard("customer.Delete"),cus.remove)

    //----- for address cutomer --------
    app.get(`${base_url}_address`,cus.listAddress)
    app.get(`${base_url}_address/:id`,cus.listOneAddress)
    app.post(`${base_url}_address`,cus.newAddress)
    app.put(`${base_url}_address`,cus.updateAddress)
    app.delete(`${base_url}_address/:id`,cus.removeAddress)

    //------- for login
    app.post(`${base_url}/auth/login`,cus.login)
    
}
module.exports = customer