const db = require("../utils/db")

const getList = async (req,res) => {
    var sql = "SELECT * FROM payment_method"
    const data = await db.query(sql)
    res.json({
        list: data.rows
    })


}
const create = async (req,res)=>{
    const {name,code} = req.body
    var sql = "INSERT INTO payment_method(name,code) VALUES($1,$2)"
    const data = await db.query(sql,[name,code])
    res.json({
        message: "Insert Success!",
        data: data
    })

} 
const remove = async (req,res)=>{
    const {payment_method_id} = req.body
    var sql = "DELETE FROM payment_method WHERE payment_method_id = $1"
    const data = await db.query(sql,[payment_method_id])
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