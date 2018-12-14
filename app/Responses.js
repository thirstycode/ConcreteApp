var jwt = require('jsonwebtoken');
var secret="supersecret";
var mysql= require('mysql');

//database connectivity
var dbconfig = require('../config/database');
var connection = mysql.createConnection(dbconfig.connection);



       var Responses=function(req,res,next){
       console.log(req.session.token);
		jwt.verify(req.session.token, secret, function(err, decoded){
	
		
		if(err){
			console.log(req.headers.authorization)
			console.log("%%%%%%%%%%%%%%%%%%%" + err);
			return res.render('login',{success:false,msg:'session expired Login again'});
		}
		var userId =  decoded.id;
	    
       if(Array.isArray(req.body.price)){
	    var price=[];
      	}
		var rmxId = userId;
		var price = req.body.price;
		var validTill = new Date(req.body.validTill).getTime();
         console.log(req.body.validTill);
		 console.log(validTill);
		var quoteId = req.body.quoteId;
		var requestedById=req.body.requestedById;
        
        console.log(req.body.price);
        console.log(req.body.validTill);
		console.log(req.body.quoteId);
	    console.log(req.body.requestedById);
		
		var response = {
			rmxId:rmxId,
			price:price,
			validTill:validTill
		}
		console.log(response);
	//	Quote.respondToQuote(quoteId, response, function(err, quote){
    connection.connect(function(err){
    console.log("Connected from respond to quotes");
    
   connection.query("select * from pricetable where quoteId='"+quoteId+"' order By id",function(err,result,fields){
   if(err) throw err;

     connection.query("select * from responses where quoteId='"+quoteId+"' order By id",function(err,result1,fields){
			if(err) throw err;
			if(result1[0].rmxId==null){
			var sql="update responses set rmxId='"+response.rmxId+"', validTill='"+response.validTill+"',userId='"+requestedById+"' where quoteId='"+quoteId+"'";
				  connection.query(sql,function(err,result2,fields){
			      if(err) throw err;
		       });
				   console.log(result[0].priceId);

				  
                   if(Array.isArray(req.body.price)){
				  for(var i=0;i<response.price.length;i++){
				  	 console.log(result[i].priceId);
		     var sql="update pricetable set price='"+response.price[i]+"' where quoteId='"+quoteId+"' && id='"+result1[0].id+"' && priceId='"+result[i].priceId+"'";
				  connection.query(sql,function(err,result3,fields){
			      if(err) throw err;
		     });	
             }
			}
			else{
                  var sql="update pricetable set price='"+response.price+"' where quoteId='"+quoteId+"' && id='"+result1[0].id+"' && priceId='"+result[0].priceId+"'";
				  connection.query(sql,function(err,result6,fields){
			      if(err) throw err;
		     });	

			}

		}
			else{
                 var sql="insert into responses (rmxId,validTill,quoteId,userId) values ('"+response.rmxId+"','"+response.validTill+"','"+quoteId+"','"+requestedById+"')";
				  connection.query(sql,function(err,result4,fields){
			      if(err) throw err;
		       
		          if(Array.isArray(req.body.price)){
		       for(var i=0;i<response.price.length;i++){
			   var sql="insert into pricetable (price,id,quoteId) values ('"+response.price[i]+"','"+result4.insertId+"','"+quoteId+"')";
				  connection.query(sql,function(err,result5,fields){
			      if(err) throw err;
                   });
				}
			}
			else{
				var sql="insert into pricetable (price,id,quoteId) values ('"+response.price+"','"+result4.insertId+"','"+quoteId+"')";
				  connection.query(sql,function(err,result7,fields){
			      if(err) throw err;
                   });
			}
		       });
              }


			res.redirect('/users/tables');
		})
	})
})

});
	}

module.exports=Responses;