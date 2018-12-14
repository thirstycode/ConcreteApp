var jwt = require('jsonwebtoken');

var mysql= require('mysql');
var session = require('express-session');

//database connectivity
var dbconfig = require('../config/database');
var connection = mysql.createConnection(dbconfig.connection);  

var pendingOrdersForSupplier=function(req,res,next){
   var secret="supersecret";
   var array=[];
   var quantityArray=[];
   var qualityArray=[];
   var orderIdArray=[];

	console.log(req.session.token);
	jwt.verify(req.session.token, secret, function(err, decoded){
		if(err){
			console.log(req.headers.authorization)
			console.log("%%%%%%%%%%%%%%%%%%%" + err);
			return res.render('login',{success:false,msg:'session expired Login again'});
		}
		var userId =  decoded.id;
		let d = new Date();
		console.log(d);
		var y = new Date(d.getTime()-(d.getHours() * 60*60*1000 + d.getMinutes()*60*1000 + d.getSeconds()*1000))
		console.log(y);
		
		
   connection.connect(function(err){
   var sql="select * from orders where supplierId='"+userId+"' && generationDate >'"+y.getTime()+"' ";
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
                        "generationDate":result[i].generationDate,
                        "requiredByDate":result[i].requiredByDate,
                        "status":result[i].status,
                        "statusDate":result[i].statusDate,
                        "quality":qualityArray[i],
                        "quantity":quantityArray[i],
                        "orderIdArray":orderIdArray[i],
                         "orderId":result[i].orderId
            }
            console.log(array[i]);
       }

		
			res.render('submitted-approved-table',{result:array});
		});
	});
});
});
}

var todayOrders=function(req,res,next){
    var secret="supersecret";
   if(req.session){
   var array=[];
   var quantityArray=[];
   var qualityArray=[];
   var orderIdArray=[];

  console.log(req.session.token);
  jwt.verify(req.session.token, secret, function(err, decoded){
    if(err){
      
      console.log("%%%%%%%%%%%%%%%%%%%" + err);
      return res.render('login',{success:false,msg:'session expired Login again'});
    }
    var userId =  decoded.id;
    //var d = new Date().toLocaleString();
    //console.log(d.toLocaleDateString());
    // var d = new Date();
    // console.log(d);
    // //console.log(d.toLocaleString());
    // var y = new Date(d.getTime()-(d.getHours() * 60*60*1000 + d.getMinutes()*60*1000 + d.getSeconds()*1000))
    // console.log(y);
    //    var z = new Date(d.getTime()-(d.getHours() * 60*60*1000 + d.getMinutes()*60*1000 + d.getSeconds()*1000) -86400000)
    // console.log(z);
    //Order.getOrdersForResponseBySupplierId(userId, y.getTime(), function(err, orders){
    
   connection.connect(function(err){
 
 //This connection will take the driver details from the driver table and pass on the result to front end
 var sql2="select * from driverdetails where supplierId='"+userId+"' ";
 connection.query(sql2,function(err,result3){
  if(err) throw err;

  var sql2="select * from dispatchorder where supplierId='"+userId+"' ";
 connection.query(sql2,function(err,result4){
  if(err) throw err;


   var sql="select * from orders where supplierId='"+userId+"' ";
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
                        "generationDate":result[i].generationDate,
                        "requiredByDate":result[i].requiredByDate,
                        "status":result[i].status,
                        "statusDate":result[i].statusDate,
                        "quality":qualityArray[i],
                        "quantity":quantityArray[i],
                        "orderIdArray":orderIdArray[i],
                         "orderId":result[i].orderId,
                         "supplierId":userId
            }
            console.log(array[i]);
       }

             console.log(result3);
          res.render('cancel-order-tables',{result:array,driver:result3,dispatchorder:result4});
       });
     });
    });
   });
 })
})
}
else{
    return res.render('login',{success:false,msg:'session expired Login again'});
}
}



var dispatchOrder=function(req,res,next){
var secret='supersecret';
var orderId=req.body.orderId;
var supplierId=req.body.supplierId;
var requestedBy=req.body.requestedBy;
var drivercontact=req.body.driver;


console.log(req.body);
var d=new Date();
var date=d.getTime();

  connection.connect(function(err){

var sql3="select * from driver where contact='"+drivercontact+"'";
   connection.query(sql3,function(err,result2){
    if(err) throw err;
    else{



   var sql2="update orders set status='Dispatched',statusDesc='Your order dispatched!! Arriving Shortly' where orderId='"+orderId+"'";
   connection.query(sql2,function(err,result1){
    if(err) throw err;

   
   var sql="insert into dispatchorder (orderId,Date,supplierId,requestedBy,drivercontact,drivername) values('"+orderId+"','"+date+"','"+supplierId+"','"+requestedBy+"','"+drivercontact+"','"+result2[0].name+"')";
   connection.query(sql,function(err,result){
   if (err) throw err;
   else{

     return res.redirect('../users/todayorders');

   }

  })
  })
}
})
})

}







var approveOrders=function(req,res,next){
var secret="supersecret";
var status = 'approved';
  var statusDate = Date.now();
  var statusDesc = req.body.statusDesc || 'The supplier has confirmed to deliver your order';
  var orderId = req.body.orderId;
     console.log(orderId);

    
    connection.connect(function(err){
   //if(err) throw err;
   var sql="update orders set status='"+status+"' , statusDesc='"+statusDesc+"' , statusDate= '"+statusDate+"' where orderId='"+orderId+"' ";
   connection.query(sql,function(err,result){


    if(err){
      res.redirect('../users/pendingorders');
    };
    
    res.redirect('../users/pendingorders');
  });
});
}


  //this function will provide all the orders of a particular supplier cancelled,approved or submmited
var Userhistory=function(req,res,next){
 var secret="supersecret";
   var array=[];
   var quantityArray=[];
   var qualityArray=[];
   var orderIdArray=[];
   console.log(req.session.token);
    jwt.verify(req.session.token, secret, function(err, decoded){

    if(err){
      console.log("%%%%%%%%%%%%%%%%%%%" + err);
      return res.render('login',{success:false,msg:'session expired Login again'});
    }
    var userId =  decoded.id;
    let d = new Date();
    var y = new Date(d.getTime()-(d.getHours() * 60*60*1000 + d.getMinutes()*60*1000 + d.getSeconds()*1000));
    console.log("about to get orders");

    console.log(y.getTime());
    connection.connect(function(err){

   var sql="select * from orders where supplierId='"+userId+"' && generationDate <'"+y.getTime()+"' || status='cancelled' ";
   connection.query(sql,function(err,result){
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
                        "generationDate":result[i].generationDate,
                        "requiredByDate":result[i].requiredByDate,
                        "status":result[i].status,
                        "statusDate":result[i].statusDate,
                        "quality":qualityArray[i],
                        "quantity":quantityArray[i],
                        "orderIdArray":orderIdArray[i]

            }
            console.log(array[i]);
       }

      res.render('history',{result:array});
    })
  })
  })
})
}









//From here all the function of application side that is index.js side
var indexHistory=function(req,res,next){
  const secret = "supersecretkey";
var array=[];
var result=[];
    jwt.verify(req.headers.authorization, secret, function(err, decoded){
        if(err){
            //console.log("%%%%%%%%%%%%%%%%%%%" + err);
            res.json({
                msg:"some error occured"
            })
            return;
        }

        var userId =  decoded.id;
           // sql connection
          connection.connect(function(err){
        console.log("Connected from history");
        var sql="select orderId,generationDate,requiredByDate,requestedBy,requestedById,supplierId,companyName,customerSite,POId,status,statusDate,statusDesc from orders where requestedById='"+userId+"'";
        connection.query(sql,function(err,result1,fields){
         if(err) throw err;
         else{


          for(var i=0;i<result1.length;i++){
                array.push([]);
              }
     
        if(result1.length<=0){
          result=[];
          res.json({
                orders:result 
               });

        }
        else{
        var sql="select * from ordermultiple where  orderId IN (";
          for(i=0;i<result1.length;i++)
            {
              var sql= sql+result1[i].orderId+",";
            }
         sql=sql.slice(0,-1);
         sql=sql+")";
      connection.query(sql,function(err,result2,fields){
        if(err) throw err;
       else{
           for(i=0;i<result1.length;i++)
            {
               
             for(var j=0;j<result2.length;j++){

                 if(result2[j].orderId==result1[i].orderId){
                          // console.log("here");
                       array[i].push(result2[j]);
                   }
                   
            }
        }


             for(var i=0;i<result1.length;i++){
                  result[i]={
                    "orderId":result1[i].orderId,
                     "generationDate":result1[i].generationDate,
                     "requiredByDate":result1[i].requiredByDate,
                     "requestedBy":result1[i].requestedBy,
                     "requestedById":result1[i].requestedById,
                     "supplierId":result1[i].supplierId,
                     "companyName":result1[i].companyName,
                      "customerSite":result1[i].customerSite,
                     "POId":result1[i].POId,
                     "status":result1[i].status,
                     "statusDate":result1[i].statusDate,
                     "statusDesc":result1[i].statusDesc,
                     "data":array[i]
                   }
                  }
           
            res.json({
                orders:result 
               
            });
          }
        });
    }
  }
    });
});

});
}


var addOrder=function(req,res,next){
  const secret = "supersecretkey";
  jwt.verify(req.headers.authorization, secret, function(err, decoded){
        if(err){
            //console.log("%%%%%%%%%%%%%%%%%%%" + err);
            res.json({
                msg:"some error occured"
            });
            return;
        }
        var userId =  decoded.id;

console.log(req.body);
// multiple orders
        var quantity=[];
        var quality=[];
        var array=[];
          
        var date = Date.now();
        var requiredByDate = req.body.requiredDate;
        var quantity = req.body.quantity;
        var quality = req.body.quality;
        var requestedBy = req.body.requestedBy;
        var requestedById = userId;
        var supplierId = req.body.supplierId;
        var companyName = req.body.companyName;
        var customerSite = req.body.customerSite;
        var customerSiteId=req.body.customesiteId;
        var POId = req.body.POId;
        var status = 'submitted';
        var statusDate = Date.now();
        var statusDesc = 'Your orders is submitted and is waiting to get confirmation from seller';

         console.log("customersiteId"+customerSiteId);
        req.checkBody('quantity', 'quantity cannot be empty').notEmpty();
        req.checkBody('quality', 'quality cannot be empty').notEmpty();
        req.checkBody('requestedBy', 'requestedBy cannot be empty').notEmpty();

        var errors = req.validationErrors();
        //console.log(errors);

        if(err){
            return handleError(err, null, res);
        }else{
            //console.log('else block called');
            var newOrder =({
                generationDate:date,
                requiredByDate:requiredByDate,
                quality:quality,
                quantity:quantity,
                requestedBy:requestedBy,
                requestedById:requestedById,
                supplierId:supplierId,
                companyName:companyName,
                customerSite:customerSite,
                POId: POId,
                status:status,
                statusDate:statusDate,
                statusDesc:statusDesc
            });
            console.log(POId);
              
        connection.connect(function(err){
          console.log("Connected form addorder");
          connection.query("select * from purchaseorder where POId='"+POId+"'", function(err,result,fields){
                
        
   
      connection.query("select * from pomultiple where POId='"+POId+"'", function(err,results,fields){
           //console.log(err);
                // console.log(result.length);
                console.log(results);
                   if(result.length<=0)
                   {
                    console.log(err);
                  return  res.json({
                        success:false,
                        msg:"there was some error placing order"
                      })
                   }
                              //console.log(result[0].remQuantity);
                              console.log(quantity);
                              console.log(quality);
               // console.log(typeof(quantity[0])); 
               // //quantity[0]=Number(quantity[0]);
               // //console.log(quantity[0]);
               // console.log(typeof(parseInt(quantity[0]))); 

        if(Array.isArray(req.body.quality)){
              for(var i=0;i<quantity.length;i++)
              {
              
                console.log(results[0].remQuantity);
                 //console.log(results[1].remQuantity);
                  // console.log(results[i].remQuantity);   
                  if(parseInt(results[i].remQuantity) < parseInt(quantity[i])){
                   console.log("here");
                   return res.json({
                        success:false,
                        msg:"The Purchase Order quantity is not enough to fulfill current Order. Please Order a new PO."
                    })
                }
                else{
                    //results[i].remQuantity = results[i].remQuantity-quantity[i];
                    array.push(parseInt(results[i].remQuantity)-parseInt(quantity[i]));
                    console.log("quantity subtracted");
  
                  
                    connection.query("update pomultiple set remQuantity='"+array[i]+"' where POId='"+newOrder.POId+"' && quality='"+newOrder.quality[i]+"'" ,function(err,result,fields){
                 if(err) throw err;
                 console.log("updated in POmultiple");
                  console.log(array);
             
                       });
                  }
                }
                console.log(array);

              var sql="Insert into orders ( generationDate , requiredByDate , requestedBy , requestedById , supplierId , companyName , customerSite,POId,status, statusDate, statusDesc,customerSiteId) values('"+newOrder.generationDate+"','"+newOrder.requiredByDate+"','"+newOrder.requestedBy+"','"+requestedById+"','"+supplierId+"','"+newOrder.companyName+"','"+newOrder.customerSite+"','"+newOrder.POId+"','"+newOrder.status+"','"+newOrder.statusDate+"','"+newOrder.statusDesc+"','"+customerSiteId+"')";
              connection.query(sql,function(err,result1,fields){
                         if(err) throw err;
                    
                             
          //to insert in ordermultiple table only for quality, quantity
          for(var i=0;i<quantity.length;i++){
           var sql="Insert into ordermultiple (quality , quantity , orderId ) values('"+newOrder.quality[i]+"','"+newOrder.quantity[i]+"','"+result1.insertId+"')";
              connection.query(sql,function(err,result2,fields){
                         if(err) throw err;
                         console.log("inserted into ordermultiple");

                 });
            }

            });
            }
           //for single quality quantity
            else{


             for(var i=0;i<results.length;i++)
              {
              
                console.log(results[0].remQuantity);
                 //console.log(results[1].remQuantity);
                  // console.log(results[i].remQuantity);   
                  if(parseInt(results[i].remQuantity) < parseInt(quantity)){
                   console.log("here");
                   return res.json({
                        success:false,
                        msg:"The Purchase Order quantity is not enough to fulfill current Order. Please Order a new PO."
                    })
                }
                else{
                
                    array.push(parseInt(results[i].remQuantity)-parseInt(quantity));
                    console.log("quantity subtracted");
  
                  
                    connection.query("update pomultiple set remQuantity='"+array[i]+"' where POId='"+newOrder.POId+"' && quality='"+newOrder.quality+"'" ,function(err,result,fields){
                 if(err) throw err;
                 console.log("updated in POmultiple");
                  console.log(array);
                   
                       });
                  }
                }
                console.log(array);

              var sql="Insert into orders ( generationDate , requiredByDate , requestedBy , requestedById , supplierId , companyName , customerSite,POId,status, statusDate, statusDesc,customerSiteId) values('"+newOrder.generationDate+"','"+newOrder.requiredByDate+"','"+newOrder.requestedBy+"','"+requestedById+"','"+supplierId+"','"+newOrder.companyName+"','"+newOrder.customerSite+"','"+newOrder.POId+"','"+newOrder.status+"','"+newOrder.statusDate+"','"+newOrder.statusDesc+"','"+customerSiteId+"')";
              connection.query(sql,function(err,result1,fields){
                         if(err) throw err;
                    
                             
          //to insert in ordermultiple table only for quality, quantity
         
           var sql="Insert into ordermultiple (quality , quantity , orderId ) values('"+newOrder.quality+"','"+newOrder.quantity+"','"+result1.insertId+"')";
              connection.query(sql,function(err,result2,fields){
                         if(err) throw err;
                         console.log("inserted into ordermultiple");

                 });
            

            });

            }
                
              
                            res.status(200).json({
                                success:true,
                                msg:'order created'
                                
                            });
                    
                   
                });
                     
            })
      });
}
})

}

var cancelOrder=function(req,res,next){
const secret = "supersecretkey";
 var orderId = req.body.orderId;
    var reason = req.body.reason;
    console.log(orderId);
    console.log(reason);
    console.log(req.body);
 
      connection.connect(function(err){
          console.log("Connected form cancelOrder");
          connection.query("select * from orders where orderId='"+orderId+"'",function(err,result,fields){
           if(err) throw err;
            result[0].statusDesc = reason;
            result[0].status = 'cancelled';
            result[0].statusDate = Date.now();
            var sql="update orders SET status='"+result[0].status+"', statusDate='"+result[0].statusDate+"',statusDesc='"+result[0].statusDesc+"' where orderId='"+orderId+"'";
                     connection.query(sql,function(err,result,fields){
              if(err) throw err;
      });
     

        if(err){
            return handleError(err, null, res);
        }
        res.json({msg:'order is cancelled',
          result:result
        })
  console.log(result);
});

        });

}

module.exports={
            pendingOrdersForSupplier:pendingOrdersForSupplier,
           todayOrders:todayOrders,
           approveOrders:approveOrders,
           Userhistory:Userhistory,
           indexHistory:indexHistory,
           addOrder:addOrder,
           cancelOrder:cancelOrder,
           dispatchOrder:dispatchOrder
             };