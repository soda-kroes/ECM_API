
const db = require("../utils/db")

const getCartBycustomer = async (req,res) =>{
    const {customer_id} = req.body;
    var sql = "SELECT c.cart_id,c.quantity, p.* FROM cart c  INNER JOIN product p ON(c.product_id = p.product_id) WHERE customer_id = $1"
    // var sql = "SELECT c.cart_id,c.quantity, p. * FROM cart c"
    // sql += "INNER JOIN product p ON (c.product_id = p.product_id)"
    // sql += "WHERE c.customer_id = $1"
    const list = await db.query(sql,[customer_id])
    res.json({
        list: list.rows
    })

}
const addCart = async (req,res) =>{
    const {
        customer_id,
        product_id,
        quantity,
    } = req.body;
    var sql = "INSERT INTO cart (customer_id,product_id,quantity) VALUES ($1,$2,$3)"
    var param = [customer_id,product_id,quantity]
    const data = await db.query(sql,param)
    res.json({
        message: "Cart add success!",
        data: data
    })

}
const removeCart = async (req,res) =>{
    var {cart_id} = req.body
    var sql = "DELETE FROM cart WHERE cart_id = $1"
    var data = await db.query(sql,[cart_id])
    res.json({
        data: data,
        message: "cart removed!"
    })
}

const updateCart = async (req,res) =>{
    const {
        cart_id,
        quantity,
    } = req.body;
    var sql = "UPDATE cart SET quantity = (quantity + $1) WHERE cart_id = $2"
    var param = [quantity,cart_id]
    const data = await db.query(sql,param)
    res.json({
        message: "Cart update success!",
        data: data
    })
}

module.exports = {
    getCartBycustomer,
    addCart,
    removeCart,
    updateCart
}