    //import express
    const  express = require('express');
    const app = express();

    //import 
    const employee = require("./src/route/employee.route")
    const category = require("./src/route/category.route")
    const customer = require("./src/route/customer.route")
    const wishList = require("./src/route/wishList.route")
    const order_status = require("./src/route/order_status.route")
    const payment_method = require("./src/route/payment_method.route")
    const cart = require("./src/route/cart.route")
    const product = require("./src/route/product.route")
    const order = require("./src/route/order.route")
    
    //import db
    const db = require("./src/utils/db")


    //allow origin (npm i cors)
    const cors = require("cors")
    app.use(cors({
        origin: "*"
    }))

    //register for use json boday
    app.use(express.json())

    employee(app)
    category(app)
    customer(app)
    wishList(app)
    order_status(app)
    payment_method(app)
    cart(app)
    product(app)
    order(app)

    app.listen(8081,()=>{
        console.log("Run On Port: 8081")
    })