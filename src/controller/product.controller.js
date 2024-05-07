const db = require("../utils/db");
const { isEmptyOrNull } = require("../utils/service");

const getParam = (value) => {
  if(value == "" || value == "null" || value == "undefined"){
      return null
  }
  return value
}

const getList = async (req, res) => {
  const { page, txtSearch, categoryId, productStatus } = req.query;
  var param = [getParam(categoryId)]
  var limitItem = 10
  var offset = (page - 1) * limitItem 
  
  var select =
    "SELECT p.*, c.name AS category_name ";
  var join = " FROM product AS p INNER JOIN category AS c ON (p.category_id = c.category_id) ";

  var where = " "
  
  if (!isEmptyOrNull(categoryId)) {
    where = " WHERE p.category_id = " + categoryId;
  }

  if (!isEmptyOrNull(txtSearch)) {
    where += ` AND (p.barcode = '${txtSearch}' OR p.name ILIKE '%${txtSearch}%')`;
    // param.push(txtSearch)
    // param.push("%"+txtSearch+"%")
  }
if (!isEmptyOrNull(productStatus)) {
    where += " AND p.is_active = '"+productStatus+"'" ///productStatus
    //param.push(productStatus)
}

var order = " ORDER BY p.product_id DESC "
var limit = " LIMIT "+limitItem+" OFFSET "+offset+""

var sql = select + join + where + order + limit;

var selectTotal = " SELECT COUNT(p.product_id) as total, SUM(quantity) as totalQty ";
var sqlTotal = selectTotal + join + where;

console.log("------------------------------------------------------\n")
console.log(sql)
console.log("------------------------------------------------------\n")
console.log(sqlTotal)
console.log("------------------------------------------------------\n")


  var sqlCategory = "SELECT * FROM category";

  try {
    const list = await db.query(sql);
    const category_list = await db.query(sqlCategory);
    const totalRecord = await db.query(sqlTotal);

    res.json({
      list: list.rows,
      totalRecord: totalRecord,
      category_list: category_list.rows,
      queryData: req.query,
      bodyData: req.body
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getOne = async (req, res) => {
  const { id } = req.params;
  var sql = "select * from product WHERE product_id = $1";

  //join category pagenation search
  const list = await db.query(sql, [id]);
  res.json({
    list: list,
  });
};

const create = async (req, res) => {
  const { category_id, barcode, name, quantity, price, image, description } =
    req.body;
  var message = {};
  if (isEmptyOrNull(category_id)) {
    message.category_id = "category id is required!";
  }

  if (isEmptyOrNull(barcode)) {
    message.barcode = "barcode is required!";
  }
  if (isEmptyOrNull(name)) {
    message.name = "name is required!";
  }
  if (isEmptyOrNull(quantity)) {
    message.quantity = "quantity is requried!";
  }
  if (isEmptyOrNull(price)) {
    message.price = "price is requried!";
  }

  var sql =
    "INSERT INTO product (category_id,barcode,name,quantity,price,image,description) VALUES($1,$2,$3,$4,$5,$6,$7)";
  var paramInsert = [
    category_id,
    barcode,
    name,
    quantity,
    price,
    image,
    description,
  ];
  const data = await db.query(sql, paramInsert);
  res.json({
    message: "Insert Success!",
    data: data,
  });
};

const update = async (req, res) => {
  const {
    product_id,
    category_id,
    barcode,
    name,
    quantity,
    price,
    image,
    description,
  } = req.body;
  var message = {};
  if (isEmptyOrNull(category_id)) {
    message.category_id = "category id is required!";
  }
  if (isEmptyOrNull(product_id)) {
    message.product_id = "product id is required!";
  }
  if (isEmptyOrNull(barcode)) {
    message.barcode = "barcode is required!";
  }
  if (isEmptyOrNull(name)) {
    message.name = "name is required!";
  }
  if (isEmptyOrNull(quantity)) {
    message.quantity = "quantity is requried!";
  }
  if (isEmptyOrNull(price)) {
    message.price = "price is requried!";
  }
  var sql =
    "UPDATE product SET category_id = $1,barcode =$2 ,name = $3 ,quantity = $4 ,price = $5, image = $6,description = $7 WHERE product_id = $8";
  var paramUpdate = [
    category_id,
    barcode,
    name,
    quantity,
    price,
    image,
    description,
    product_id,
  ];
  const data = await db.query(sql, paramUpdate);
  res.json({
    message: "Update Success!",
    data: data,
  });
};

const remove = async (req, res) => {
  var { product_id } = req.body;
  var sql = "DELETE FROM product WHERE product_id = $1";
  const data = await db.query(sql, [product_id]);
  res.json({
    message: "Product Deleted!",
    list: data,
  });
};

const change_product_status = async (req, res) => {
  const { is_active } = req.body;
  var sql = "UPDATE product SET is_active $1 WHERE product_id = $2";
  const data = await db.query(sql, [is_active]);
  res.json({
    message:
      "Update product status to " + (is_active == 0 ? "inactived" : "actived"),
    data: data,
  });
};

module.exports = {
  getList,
  getOne,
  create,
  update,
  remove,
  change_product_status,
};
