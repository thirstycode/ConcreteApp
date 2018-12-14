    var mysql= require('mysql');
    var jwt = require('jsonwebtoken');
   // var secret="supersecret";
    // const secret = "supersecretkey";


    //database connectivity
var dbconfig = require('../config/database');
var connection = mysql.createConnection(dbconfig.connection); 



var indexGetSupplierName=function(req,res,next){
 var id = req.body.supplierId;
    console.log(id)
         
     connection.connect(function(err){

    console.log("Connected form getsuppliername");
    connection.query("select * from user where userId='"+id+"'",function(err,result,fields){
 

        if(err){
            return handleError(err, null, res);
        }
        
        if(result.length>0){
            return res.json({
                success:true,
                supplierName: result[0].name
            })
        }else{
            return res.json({
                success:false,
                msg:"no user found"
            })
        }
    });
});
 }

  var indexDoesExist=function(req,res,next){
    var email = req.body.email;
    
        console.log(email);

   connection.connect(function(err){
   //if(err) throw err;
   var sql="select * from user where email='"+email+"'";
   console.log(email);
   connection.query(sql,function(err,result){
      console.log(result);
        if(err){
            return handleError(err, null, res);
        }
        if(result.length>0){
            return res.json({
                success:true,
                user:true
            })
        }else{
            return res.json({
                success:true,
                user:false
            })
        }
    });
});
}

 module.exports={
    indexGetSupplierName:indexGetSupplierName,
    indexDoesExist:indexDoesExist
 }