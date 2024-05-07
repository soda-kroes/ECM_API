const db = require("../utils/db")

const getList = async (req,res)=>{
    var sql = "SELECT * FROM wishList";
    const data = await db.query(sql)
    res.json({
        list: data.rows
    })


}
const create = async (req,res)=>{
    const {product_id,customer_id}=  req.body;
    var sql = "INSERT INTO wishlist(product_id,customer_id) VALUES($1,$2)"
    var param = [product_id,customer_id]
    var data =  await db.query(sql,param)
    res.json({
        message: "Product Add!",
        data: data
    })

}

const remove = async (req,res)=>{
    const {wishlist_id} = req.body
    var sql = "DELETE FROM wishlist WHERE wishlist_id = $1";
    var data = await db.query(sql,[wishlist_id])
    res.json({
        message: "Product Remove from your wishlist",
        data: data
    })
}

module.exports = {
    getList,
    create,
    remove
}