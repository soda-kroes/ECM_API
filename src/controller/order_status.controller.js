
const db = require("../utils/db")
const getList = async (req,res) =>{
    var sql = "SELECT * FROM order_status"
    const data = await db.query(sql)
    res.json({
        list: data.rows
    }) 
}

const create = async (req,res) =>{
    var {name,message,sort_order} = req.body
    var sql = "INSERT INTO order_status(name,message,sort_order) VALUES($1,$2,$3)"
    var param = [name,message,sort_order]
    var data = await db.query(sql,param)
    res.json({
        data: data
    })
} 

const remove = async (req,res) =>{
    const {order_status_id} = req.body
    var sql = "DELETE FROM order_status WHERE order_status_id = $1"
    const data = await db.query(sql,[order_status_id])
    res.json({
        message: "Remove Success!",
        data: data
    })
}

module.exports = {
    getList,
    create,
    remove
}
