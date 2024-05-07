
const db = require("../utils/db")
const { isEmptyOrNull, invoinceNumber } = require("../utils/service")


const generateInvoiceNo = async () =>{
    const data = await db.query("SELECT MAX(order_id) as id FROM orders")
    return invoinceNumber(data.rows[0].id)//null,1,2,3
}


const getList = async (req,res)=>{
    var sql = "select * from orders"
    var data = await db.query(sql)
    res.json({
        list: data.rows
    })

}
const getOne = async (req,res) =>{
    const list = await db.query("SELECT * FROM orders WHERE order_id =$1",[req.params.id])
    res.json({
        list: list.rows
    })
}


const getByCustomerId = async (req,res)=>{
    const {customer_id} = req.body
    var list = await db.query("SELECT * FROM  orders WHERE customer_id = $1",[customer_id])
    res.json({
        list: list
    })
};


const create = async (req, res) => {
    try {
       await db.query('BEGIN');
  
      const {
        customer_id,
        customer_address_id,
        payment_method_id,
        comment
      } = req.body;
  
      const order_status_id = 1; // pending
      const invoice_no = await generateInvoiceNo() //await generateInvoiceNo();
      
      var message = {};
  
      if (isEmptyOrNull(invoice_no)) {
        message.invoice_no = "invoice_no is required!";
      }
      if (isEmptyOrNull(customer_id)) {
        message.customer_id = "customer_id required!";
      }
      if (isEmptyOrNull(order_status_id)) {
        message.order_status_id = "order_status_id is required!";
      }
      if (isEmptyOrNull(payment_method_id)) {
        message.payment_method_id = "payment_method_id is required!";
      }
      if (Object.keys(message).length > 0) {
        res.json({
          error: true,
          message: message
        });
        return;
      }
  
      // Find customer address info by address_id (on the client side)
      var address = await db.query("SELECT * FROM customer_address WHERE customer_address_id = $1", [customer_address_id]);
  
      if (address.rowCount > 0) {
        const { firstname, lastname, tel, address_des } = address.rows[0];
  
        // Find total_order => need to getCartInfo by customer
        var productData = await db.query("SELECT c.*, p.price FROM cart c INNER JOIN product p ON (c.product_id = p.product_id) WHERE customer_id = $1", [customer_id]);
       
        if(productData.rowCount > 0){
          // productData is an array
          var orderTotal = 0;
          productData.rows.map(async (item,index)=>{
            orderTotal += item.quantity * item.price;
          })

          // Insert data into the order
          var sqlOrder = "INSERT INTO orders (customer_id,invoice_no,order_status_id,payment_method_id, comment, order_total, firstname, lastname, telephone, address_des) VALUES ($1, $2, $3, $4, $5, $6, $7, $8,$9,$10) RETURNING order_id";
          var sqlOrderParam = [customer_id,invoice_no,order_status_id, payment_method_id, comment, orderTotal, firstname, lastname, tel, address_des];
          const orderData = await db.query(sqlOrder, sqlOrderParam);


          // Insert order detail
          const orderId = orderData.rows[0].order_id; // Extract the order_id from the result
          productData.rows.map(async (item, index) => {
            var sqlOrderDetail = "INSERT INTO order_detail (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)";
            var sqlOrderDetailParam = [orderId, item.product_id, item.quantity, item.price];
            var orderDetail = await db.query(sqlOrderDetail, sqlOrderDetailParam);

            //cut stock from table product 
            var sqlProduct = "UPDATE product SET quantity = (quantity-$1) WHERE product_id = $2"
            var updateProduct = await db.query(sqlProduct,[item.quantity,item.product_id])
          });
          //clear cart by customer
          await db.query("DELETE FROM cart WHERE customer_id = $1",[customer_id])

          res.json({
            message: "INSERT SUCCESS",
           
          })
          await db.query('COMMIT');
        }else{
            res.json({
                message: "Your cart is empty.",
                error: true
            })
        }
         
           
          
 
          //feature on this route
          //1. generate invoice-no
          //2. select address customer
          //3. find total
          //4. insert order
          //5. insert order_detail
          //6. update stock
          //7. clear cart
    }else{
        res.json({
            message: "Please Select Address!"
        })
    }

    } catch (e) {
      await db.query('ROLLBACK');
      console.log(e);
    }
  };


const update = async(req,res)=>{

}
const remove = async(req,res)=>{

}

module.exports = {
    getList,
    getOne,
    update,
    remove,
    create
}




       

