const jwt = require("jsonwebtoken");
const { KEY_TOKEN } = require("../utils/service");
const db = require("../utils/db");

exports.userGuard = (parameter) =>{
  return (req,res,next) =>{
  var authorization = req.headers.authorization;
  var token_from_client = null;

  if (authorization && authorization !== "") {
    var token_parts = authorization.split(" ");
    if (token_parts.length === 2) {
      token_from_client = token_parts[1];
    }
  }

  if (token_from_client === null) {
    res.status(401).send({
      message: "Unauthorized",
      token: token_from_client
    });
  } else {
    jwt.verify(token_from_client, KEY_TOKEN, (error, result) => {
      if (error) {
        res.status(401).send({
          message: "Unauthorized",
          error: error
        });
      } else {
        //check permission
        //var permission = result.data.permission;
     
        var permission = result.data.permission.map(p => p.trim()); 
        req.user = result.data //write use properties
        req.user_id = result.data.user.customer_id
       
        if(parameter == null){
          next();
        }
        else if(permission.includes(parameter)){
          next();
        }else{
          res.status(401).send({
            message: "Unauthorized",
            error: error
          });
        }
        
      }
    });
  }

  }
}






exports.getPermissionByUser = async (id) => {
  var sql =
    "SELECT p.code" +
    " FROM employee c" +
    " INNER JOIN role r ON c.role_id = r.role_id" +
    " INNER JOIN role_permission rp ON r.role_id = rp.role_id" +
    " INNER JOIN permission p ON rp.permission_id = p.permission_id" +
    " WHERE c.employee_id = $1";

  var list = await db.query(sql, [id]);
  var tmpArr = [];
  list.rows.forEach((element) => {
    tmpArr.push(element.code);
  });
  return tmpArr;
};