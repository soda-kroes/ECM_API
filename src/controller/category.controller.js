//create function crud
//import database
const db = require("../utils/db")
const { isEmptyOrNull } = require("../utils/service")

const getList = async (req,res)=>{
    const list = await db.query("SELECT * FROM category")
    
    res.json({
        list: list.rows
    })

    // var sql = "SELECT * FROM category ORDER BY category_id"
    // db.query(sql,(error,result)=>{
    //     if(error){
    //         console.log(error)
    //         res.json({
    //             error:true,
    //             msg: error
    //         })
    //     }else{
    //         res.json({
    //             list: result.rows
    //         })
    //     }
    // })

}
const getOne = (req,res)=>{
    var id = req.params.id
    var sql = "SELECT * FROM category WHERE category_id = $1"
    db.query(sql,[id],(error,result)=>{
        if(error){
            console.log(error)
            res.json({
                error: true,
                msg: error
            })
        }
        else{
            res.json({
                data: result.rows
            })
        }
    })
    
}
const create = (req,res)=>{
    const {name,description,parent_id,status} = req.body

    //for handle empty field
    const message = {}
   
    if(isEmptyOrNull(status)){
        message.status="status is requre!"
    }
    if(Object.keys(message).length>0){
        res.json({
            error: true,
            msg: message
        })
        return //stop code
    }
    
    var sql = "INSERT INTO category (name,description,parent_id,status) VALUES ($1,$2,$3,$4)"
    const param_data = [name,description,parent_id,status]
    db.query(sql,param_data,(error,result)=>{
        if(error){
            console.log(error)
            res.json({
                error:true,
                msg: error
            })
        }else{
            res.json({
                msg: "Category create success.",
                data: result
            })
        }
    })
    
}
const update = (req,res)=>{
    const {category_id,name,description,parent_id,status} = req.body
    var sql = "UPDATE category SET name=$1, description = $2, parent_id=$3, status=$4 WHERE category_id= $5"
    const param_data  = [name,description,parent_id,status,category_id]
    db.query(sql,param_data,(error,result)=>{
        if(error){
            res.json({
                error: true,
                msg: error
            })
        }else{
            res.json({
                msg: (result.rowCount != 0) ? "Data update success.": "Category not found."
            })
        }
    })
    
}
const remove = (req,res)=>{
    var id = req.params.id
    var sql = "DELETE FROM category WHERE category_id = $1"
    db.query(sql,[id],(error,result)=>{
        if(error){
            res.json({
                error: true,
                msg: error
            })
        }else{
            res.json({
                msg: (result.rowCount != 0) ? "Data delete from system success." : "Category not found.",
                data: result
            })
        }
    })
}

module.exports = {
    getList,
    getOne,
    create,
    update,
    remove
}