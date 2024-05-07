
const st = require("../controller/order_status.controller")

const order_status = (app) => {
    var base_url = "/api/order_status"
    app.get(base_url,st.getList)
    app.post(base_url,st.create)
    app.delete(base_url,st.remove)
}
module.exports = order_status