
const { userGuard } = require("../controller/auth.controller")
const cat = require("../controller/category.controller")

const category = (app) =>{
    var base_url = "/api/category"
    app.get(base_url,userGuard("category.Read"),cat.getList)
    app.get(`${base_url}/:id`,userGuard("category.Read"),cat.getOne)
    app.post(base_url,userGuard("category.Create"),cat.create)
    app.put(base_url,userGuard("category.Update"),cat.update)
    app.delete(base_url+"/:id",userGuard("category.Delete"),cat.remove)
}
module.exports = category