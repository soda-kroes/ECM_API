    const { text } = require("express");
    const db = require("../utils/db");
    const { isEmptyOrNull, KEY_TOKEN } = require("../utils/service");
    const bcrypt = require("bcrypt");
    const jwt = require("jsonwebtoken")



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
    const user = await db.query("SELECT * FROM customer WHERE username = $1", [username]);

    if (user.rowCount > 0) {
      const passDb = user.rows[0].password.trim();
     
      const isCorrect = bcrypt.compareSync(password, passDb);
  

      if (isCorrect) {
        const userData = { ...user.rows[0] };
        delete userData.password;
        

        const obj = {
          user: userData,
          token: ""
          // Generate token using JWT
         
        };
        var access_token = jwt.sign({ data: { ...obj } },KEY_TOKEN,{expiresIn: "1h"}) // Use environment variable for the secret key
        var permission = await getPermissionByCustomer(user.rows[0].customer_id)
       
        res.json({
          ...obj,
          permission: permission.rows,
          access_token: access_token,
         
          
        });
      } else {
        res.json({
          message: "Password is incorrect!",
          error: true
        });
      }
    } else {
      res.json({
        message: "User not found!",
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



    //create function
    const getList = async (req, res) => {
      var sqlProvince = "SELECT * FROM province"
      var sqlCustomer = "SELECT * FROM customer WHERE is_active != 0 ORDER BY customer_id DESC";
      var listProvince = await db.query(sqlProvince)
      var listCustomer = await db.query(sqlCustomer)
      res.json({
        listProvince: listProvince.rows,
        listCustomer: listCustomer.rows
      });
    };

    const getOne = (req, res) => {
      var id = req.params.id;
      var sql = "SELECT * FROM customer WHERE customer_id = $1";
      db.query(sql, [id], (error, result) => {
        if (error) {
          res.json({
            error: true,
            msg: error,
          });
        } else {
          res.json({
            list: result.rows,
          });
        }
      });
    };

    const create = (req, res) => {

      const {
        firstname,
        lastname,
        gender,
        username,
        password,
        province_id,
        address_des,
      } = req.body;

      // Validate
      const message = {};
      if (isEmptyOrNull(username)) {
        message.username = "Username is required!";
      }
      if (Object.keys(message).length > 0) {
        return res.json({
          error: true,
          message: message,
        });
      }

    
      // Check if customer exists
      const sqlFind = "SELECT customer_id FROM customer WHERE username = $1";
      db.query(sqlFind, [username], (error1, result1) => {

        if (error1) {
          return res.json({
            error: true,
            message: error1,
          });
        }


        if (result1.rowCount > 0) {
          return res.json({
            error: true,
            message: "Account already exists!",
          });
        }

        // Bcrypt password
        const hashPassword = bcrypt.hashSync(password, 10);

       // Insert into table customer
          const sqlCustomer =
          "INSERT INTO customer (firstname, lastname, gender, username, password) VALUES ($1, $2, $3, $4, $5) RETURNING customer_id";
          const paramCustomer = [firstname, lastname, gender, username, hashPassword];
          db.query(sqlCustomer, paramCustomer, (error2, result2) => {
          if (error2) {
            return res.json({
              error: true,
              message: error2.message
            });
          } else {
           
            console.log(result2);
            res.json({
              data: result2,
            });
          }

          const customerId = result2.rows[0].customer_id; // Extract the customer_id from the result
          
          // Insert into table customer address
          const sqlCustomerAddress =
            "INSERT INTO customer_address (customer_id, province_id, firstname, lastname, tel, address_des) VALUES ($1, $2, $3, $4, $5, $6)";
          const paramCustomerAddress = [
            customerId,
            province_id,
            firstname,  
            lastname,
            username,
            address_des,
          ];

          db.query(sqlCustomerAddress, paramCustomerAddress, (error3, result3) => {
            if (!error3) {
              res.json({
                message: "Account created!",
                data: result3,
              });
            }else{
              res.json({
                error: true,
                message: error3.message,
              });
            }
             
          });
          
        });
      });
    };

    const update = (req, res) => {
    const {
      customer_id,
      firstname,
      lastname,
      gender,
      username
    } = req.body
    var sqlUpdate = "UPDATE customer SET firstname = $1, lastname = $2, gender = $3, username = $4 WHERE customer_id = $5";
    const paramCustomerUpdate = [firstname,lastname,gender,username,customer_id];
    db.query(sqlUpdate,paramCustomerUpdate,(error,result)=>{
      if(error){
        console.log(error)
        res.json({
          error: true,
          message: error
        })
      }else{
        res.json({
          message: (result.rowCount != 0 )? "Update Success." : "Not Found",
          data: result
        })
      }

    })
    };

    const remove = (req, res) => {
      var id = req.params.id;
      var sql = "Update customer SET is_active = 0 where customer_id = $1";
      db.query(sql, [id], (error, result) => {
        if (error) {
          res.json({
            error: true,
            msg: error,
          });
        } else {
          res.json({
            msg:
              result.rowCount != 0
                ? "Data Delete From System Success."
                : "Data Not Found.",
            data: result,
          });
        }
      });
    };


    //---------------------------------------||| For Handle Customer Address |||--------------------------------
    const listAddress = (req, res) => {
      var {customer_id} = req.body
      var sql = "SELECT * FROM customer_address WHERE customer_id = $1"
      db.query(sql,[customer_id],(error,row)=>{
        if(error){
          res.json({
            error: true,
            message: error
          })
        }else{
          res.json({
            list: row.rows 
          })
        }
      })
    };
    const listOneAddress = (req, res) => {
      var id = req.params.id
      var sql = "SELECT * from customer_address WHERE customer_address_id = $1";
      db.query(sql,[id],(error,result)=>{
        if(error){
          res.json({
            error: true,
            message: error,
          })
        }else{
          res.json({
            data: result
          })
        }
      })
    };

    const newAddress = (req, res) => {
      var sql = "INSERT INTO customer_address(customer_id,province_id,firstname,lastname,tel,address_des) VALUES($1,$2,$3,$4,$5,$6)"
      const {
        customer_id,
        province_id,
        firstname,
        lastname,
        tel,
        address_des,
      } = req.body;

      const paramInsert = [customer_id,province_id,firstname,lastname,tel,address_des]

      // Validate
      const message = {};
      if (isEmptyOrNull(lastname)) {
        message.username = "Username is required!";
      }
      if(isEmptyOrNull(firstname)){
        message.firstname = "Firstname is required!";
      }
      if (Object.keys(message).length > 0) {
        return res.json({
          error: true,
          message: message,
        });
      }
      db.query(sql,paramInsert,(error,result)=>{
        if(error){
          res.json({
            error: true,
            message: error
          })
        }else{
          res.json({
            data: result
          })
        }
      })
    };
    const updateAddress = (req, res) => {
      const {
        customer_address_id,
        customer_id,
        province_id,
        firstname,
        lastname,
        tel,
        address_des,
      } = req.body

      var sqlUpdate = "UPDATE customer_address SET customer_id = $1, province_id = $2, firstname=$3, lastname=$4, tel=$5, address_des = $6 WHERE customer_address_id = $7"
      var paramUpdate = [customer_id,province_id,firstname,lastname,tel,address_des,customer_address_id]
      db.query(sqlUpdate,paramUpdate,(error,result)=>{
        if(error){
          console.log(error)
          res.json({
            error: true,
            message: error
          })
        }else{
          
          res.json({
            msg:
            result.rowCount != 0
              ? "Update Success."
              : "Customer Address Not Success.",
          data: result,
          })
        }
      })
    };
    const removeAddress = (req, res) => {
      var id = req.params.id
      var sqlRemove = "DELETE FROM customer_address WHERE customer_address_id = $1";
      db.query(sqlRemove,[id],(error,result)=>{
        if(error){
          res.json({
            error: true,
            message: error
          })
        }else{
          res.json({
            message: result.rowCount !=0 ? "Delete Success.": "Customer Address Not Found."
          })
        }
      })

    };

    module.exports = {
      getList,
      getOne,
      remove,
      create,
      update,
      listAddress,
      newAddress,
      updateAddress,
      removeAddress,
      listOneAddress,
      login,
    };
