
const db = require("../utils/db");
const { isEmptyOrNull, KEY_TOKEN, REFRESH_KEY } = require("../utils/service");
const bcrypt = require("bcrypt");
const { getPermissionByUser } = require("./auth.controller");
const jwt = require("jsonwebtoken")

const getList = (req,res)=>{
   var sql = "SELECT * FROM employee ORDER BY employee_id";
   db.query(sql,(err,result)=>{
        if(err){
           res.json({
            msg: err
           })
        }else{
            res.json({
                list: result.rows
            })
        }
   })

}

const getOneByParam = (req,res)=>{
    var id = req.params.id //params from client
    var sql = "SELECT * FROM employee WHERE employee_id = $1";
    db.query(sql,[id],(error,result)=>{
        if(error){
            res.json({
                msg: error,
                error: true,
                id: id
            })
        }
        else{
            res.json({
                list: result.rows
            })
        }
    })
    
}

// login
const login = async (req, res) => {

  const { username, password } = req.body;
  const message = {};

  if (!username) {
    message.username = "Username is required!";
  }

  if (!password) {
    message.password = "Password is required!";
  }

  if (Object.keys(message).length > 0) {
    res.json({
      message: message,
      error: true
    });
    return;
  }

  try {
    const user = await db.query("SELECT * FROM employee WHERE tel = $1", [username]);
    if (user.rowCount > 0) {
      const passDb = user.rows[0].password.trim();
      const isCorrect = bcrypt.compareSync(password, passDb);
  
      if (isCorrect) {
        const userData = { ...user.rows[0] };
        delete userData.password;
        var permission = await getPermissionByUser(user.rows[0].employee_id);
       
        const obj = {
          user: userData,
          permission: permission
          // Generate token using JWT
        };
        var access_token = jwt.sign({ data: { ...obj } },KEY_TOKEN,{expiresIn: "1h"}) // Use environment variable for the secret key
        var refresh_token = jwt.sign({ data: {...obj}},REFRESH_KEY)
       
        res.json({
          ...obj,
          access_token: access_token,
          refresh_token: refresh_token 
        });
      } else {
        res.json({
          message: "Password is incorrect!",
          error: true
        });
      }
    } else {
      res.json({
        message:"Account does't exist!. Please goto register!",
        error: true
      });
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({
      message: "An error occurred during login.",
      error: true
    });
  }
};


//refresh token
const refreshToken = async (req, res) => {
  //check and verify refresh token from client
  var { refresh_key } = req.body;

  if (isEmptyOrNull(refresh_key)) {
    res.status(401).send({
     message: "Unauthorized",
     soda: 1
    });
  } else {
   jwt.verify(refresh_key, REFRESH_KEY, async (error, result) => {
     if (error) {
       res.status(401).send({
         message: "Unauthorized",
         error: error
       });
     } else {
       //som sit teanh yk token thmey
       var username = result.data.user.tel;
       var user = await db.query("SELECT * FROM Employee WHERE tel = $1", [username]);
        user = user.rows[0];
       delete user.password;

       var permission = await getPermissionByUser(user.employee_id);

       const obj = {
         user: user,
         permission: permission
       };

       var access_token = jwt.sign({ data: { ...obj } }, KEY_TOKEN, { expiresIn: "30s" });
       var refresh_token = jwt.sign({ data: { ...obj } }, REFRESH_KEY);

       res.json({
         ...obj,
         access_token: access_token,
         refresh_token: refresh_token
       });
     }
   });
  }
};

const setPasword = async (req,res)=>{
    const {username,password} = req.body;
    var message = {}
    if(isEmptyOrNull(username)){message.username = "please fill username! "}
    if(isEmptyOrNull(password)){message.password = "please fill password! "}
    if(Object.keys(message).length>0){
        res.json({
            error:true,
            message: message
        })
        return;
    }
    var employee = await db.query("SELECT * FROM employee WHERE tel = $1",[username])
    if(employee.rowCount > 0){
        var passwordGenerate = bcrypt.hashSync(password,10);//12345 =>dfjksdhfskdfsjdfhjdshkfdsf
        console.log(passwordGenerate);
        var update = await db.query("UPDATE employee SET password = $1 WHERE tel = $2",[passwordGenerate,username]);
        res.json({
            message: "password updated!",
            data: update
        })

    }

}

const create = (req, res) => {
    const { firstname, lastname, tel, base_salary, province, country,role_id } = req.body;

    //for protect Empty Field
    var message = {}
    if(isEmptyOrNull(firstname)){
        message.firstname = "firstname is required!"
    }
    if(isEmptyOrNull(lastname)){
        message.lastname = "lastname is required!"
    }
    if(isEmptyOrNull(tel)){
        message.tel = "tel is required!"
    }
    
    if(Object.keys(message).length>0){
        res.json({
            error: true,
            message: message,
            

        })
        return //stop code execute
    }


    var param_data = [firstname, lastname, tel, base_salary, province, country,role_id]
    var sql = "INSERT INTO employee (firstname, lastname, tel, base_salary, province, country,role_id) VALUES ($1, $2, $3, $4, $5, $6,$7)";
    db.query(sql,param_data,(error, result) => {
        if (error) {
          console.error("ERROR: " + error);
          res.json({
            msg: error,
            error: true,
          });
        } else {
          res.json({
            msg: "Employee create success.",
            data: result,
          });
        }
      }
    );
  };

  const update = (req,res)=>{
    const { employee_id,firstname, lastname, tel, base_salary, province, country } = req.body;
    var sql = "UPDATE employee SET firstname= $1, lastname= $2, tel=$3, base_salary= $4, province= $5, country= $6 WHERE employee_id = $7";
    var param_data = [firstname, lastname, tel, base_salary, province, country,employee_id]
    db.query(sql,param_data,(error,result)=>{
        if(error){
            res.json({
                msg: error,
                error: true
            })
        }else{
            res.json({
                msg: (result.rowCount !=0 ) ? "Update success." : "Employee Not Found.",
                data: result
            })
        }
    })

  }

  const remove = (req,res)=>{
    //var id = req.params.id;
    var {id} = req.params;
    var sql = "DELETE FROM employee WHERE employee_id= $1";
    db.query(sql,[id],(error,result)=>{
        if(error){
            console.log("ERROR: "+error)
            res.json({
                msg: error,
                error: true
            })
        }else{
            res.json({
                msg: (result.rowCount!=0) ? "Data Delete From System Success." : "Employee Not Found.",
                data: result
            })
        }
    })
  }

module.exports={
    getList,
    getOneByParam,
    create,
    update,
    remove,
    setPasword,
    login,
    refreshToken
}