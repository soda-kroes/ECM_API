const { userGuard } = require("../controller/auth.controller")
const emp = require("../controller/employee.controller")

const employee = (app) =>{
    const base_route = "/api/employee"
    app.get(base_route,userGuard(),emp.getList)
    app.get(base_route+"/:id",userGuard(),emp.getOneByParam)
    app.post(base_route,userGuard(),emp.create)
    app.put(`${base_route}`,userGuard(),emp.update)
    app.delete(`${base_route}/:id`,userGuard(),emp.remove)
    app.post(`${base_route}_set_password`,userGuard(),emp.setPasword)
    app.post(`${base_route}_login`,emp.login)
    app.post(`${base_route}_refresh_token`,emp.refreshToken)
}
module.exports=employee