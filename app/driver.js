
  var mysql= require('mysql');
   var jwt = require('jsonwebtoken');

     //database connectivity
var dbconfig = require('../config/database');
var connection = mysql.createConnection(dbconfig.connection);


var GetDriverDetails=function(req,res,next){
	var secret="supersecret";

console.log(req.session.token);
	jwt.verify(req.session.token, secret, function(err, decoded){

	if(err){
			console.log("%%%%%%%%%%%%%%%%%%%" + err);
			return res.render('login',{success:false,msg:'session expired Login again'});
		}
		var supplierId =  decoded.id;
		console.log(supplierId);
		console.log(decoded);

			
      connection.connect(function(err){
   
    console.log("Connected form driver");
    connection.query("select * from driverdetails where supplierId='"+supplierId+"'",function(err,results,fields){
   if(err) throw err;

   
	res.render('form',{result:results,search:{}});	     
             

		})
	})
})
}

var SearchDriver=function(req,res,next){
var secret="supersecret";
 var contact=req.body.contact;
console.log(contact);


console.log(req.session.token);
	jwt.verify(req.session.token, secret, function(err, decoded){

	if(err){
			console.log("%%%%%%%%%%%%%%%%%%%" + err);
			return res.render('login',{success:false,msg:'session expired Login again'});
		}
		var supplierId =  decoded.id;
		console.log(supplierId);
		console.log(decoded);

			
      connection.connect(function(err){
   
    connection.query("select * from driver where supplierId='"+supplierId+"'",function(err,results,fields){
   if(err) throw err;

   
    console.log("Connected form post driverdetails");
    var sql="select * from driver where contact='"+contact+"'";
    connection.query(sql,function(err,result,fields){
   if(err) throw err;



	res.render('form',{result:results,search:result});	  
             

		})
	})
})
  })
}



var PostDriverDetails=function(req,res,next){
var secret="supersecret";
	

console.log(req.session.token);
	jwt.verify(req.session.token, secret, function(err, decoded){

	if(err){
			console.log("%%%%%%%%%%%%%%%%%%%" + err);
			return res.render('login',{success:false,msg:'session expired Login again'});
		}
		var supplierId =  decoded.id;
		console.log(supplierId);
		console.log(decoded);
		
          var vehicleNumber=req.body.vehicleNumber;

          var date=new Date(req.body.medicalDate);
          var medicalDate=date.getTime();
          console.log(medicalDate);
          var supplierId=supplierId;
          var contact=req.body.contact;
	
			
      connection.connect(function(err){
   
    console.log("Connected form post driverdetails");
    var sql="update driver SET vehicleNumber='"+vehicleNumber+"',medicalDate='"+medicalDate+"',supplierId='"+supplierId+"' where contact='"+contact+"' ";
    connection.query(sql,function(err,result,fields){
   if(err) throw err;

res.redirect('../users/driverdetails');
     
             

		})
	})
})

}


var UnregisterDriver=function(req,res,next){

var contact=req.body.contact;
var vehicleNumber=null;
var medicalDate=null;
var supplierId=null;

    connection.connect(function(err){
   
    console.log("Connected form UnregisterDriver");
    var sql="update driver SET vehicleNumber='"+vehicleNumber+"',medicalDate='"+medicalDate+"',supplierId='"+supplierId+"' where contact='"+contact+"' ";
    connection.query(sql,function(err,result,fields){
   if(err) throw err;	
    
    res.redirect('../users/driverdetails')

   })
 })
}







module.exports={
	GetDriverDetails:GetDriverDetails,
	PostDriverDetails:PostDriverDetails,
	SearchDriver:SearchDriver
}