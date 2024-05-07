

const wh = require("../controller/wishList.controller")
const wishList = (app)=>{
    var base_url = "/api/wishList"
    app.get(base_url,wh.getList)
    app.post(base_url,wh.create)
    app.delete(base_url,wh.remove)
}
module.exports=wishList