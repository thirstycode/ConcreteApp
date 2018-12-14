var jwt = require('jsonwebtoken');
var secret="supersecret";
var mysql= require('mysql');
var session = require('express-session');

//database connectivity
var dbconfig = require('../config/database');
var connection = mysql.createConnection(dbconfig.connection);

var getPendingProfilesForVerification=function(req,res,next){
   console.log("Connected form getPendingProfilesForVerification");
      connection.connect(function(err){
    connection.query("select * from user where verified='false' && userType='supplier'",function(err,result,fields){
   if(err) throw err;

    console.log(result);
    res.render('AdminDashboard', {
      result: result
    })
  })
  })
}

var verifyUser=function(req,res,next){
  var userId=req.body.userId;
    console.log(userId);
 
   connection.connect(function(err){   
    connection.query("update user set verified='true' where userId='"+userId+"'",function(err,result,fields){

 console.log("Connected form verifyuser");
    res.redirect('/admin/');
  })
  })
}




var adminDatabase=function(req,res,next){
//global array to make order sequence
   var array=[];
   var quantityArray=[];
   var qualityArray=[];
   var orderIdArray=[];



//checking session use for token
console.log(req.session.token);
	jwt.verify(req.session.token, secret, function(err, decoded){
//	jwt.verify(req.headers.authorization, secret, function(err, decoded){
	if(err){
			console.log("%%%%%%%%%%%%%%%%%%%" + err);
			return res.render('login',{success:false,msg:'session expired Login again'});
		}
		var userId =  decoded.id;
		console.log(userId);
			
      connection.connect(function(err){
  
    console.log("Connected form admindb");
    connection.query("select * from user",function(err,result1,fields){
   if(err) throw err;
  console.log(result1);

 //here orders will be send 
 
		

   var sql="select * from orders";
   connection.query(sql,function(err,result){
   console.log(sql);
   console.log(result);
			
          for(var i=0;i<result.length;i++)
          {
            qualityArray.push([]);
            quantityArray.push([]);
            orderIdArray.push([]);
        }

 var sql="select * from ordermultiple where orderId IN (";
 for(i=0;i<result.length;i++){

       var sql= sql+result[i].orderId+",";
         }       
         sql=sql.slice(0,-1);
         sql=sql+")"; 
         console.log(sql);
        connection.query(sql,function(err,results){
			console.log(results);
		

         

        for(var i=0;i<result.length;i++)
            {
               
             for(var j=0;j<results.length;j++){

                 if(results[j].orderId==result[i].orderId){
                 
                     quantityArray[i].push(results[j].quantity);
                     qualityArray[i].push(results[j].quality);
                     orderIdArray[i].push(results[j].orderId);
                   }
                              
           }
          }
          console.log(qualityArray);
          console.log(quantityArray);
          console.log(orderIdArray);


			for(var i=0;i<result.length;i++){
            array[i]={
                        "requestedBy":result[i].requestedBy,
                        "requestedById":result[i].requestedById,
                        "generationDate":result[i].generationDate,
                        "requiredByDate":result[i].requiredByDate,
                       "supplierId":result[i].supplierId,
                       "companyName":result[i].companyName,
                       "customerSite":result[i].customerSite,
                       "POId":result[i].POId,
                        "status":result[i].status,
                        "statusDate":result[i].statusDate,
                         "statusDesc":result[i].statusDesc,
                         "quality":qualityArray[i],
                        "quantity":quantityArray[i],
                        "orderIdArray":orderIdArray[i],
                         "orderId":result[i].orderId
            }
            console.log(array[i]);
       }

		
	res.render('database',{user:result1,order:array});	     
             
		})
	})
})
});
    });
}


module.exports={
  adminDatabase:adminDatabase,
  getPendingProfilesForVerification:getPendingProfilesForVerification,
  verifyUser:verifyUser
};