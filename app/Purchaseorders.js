var jwt = require('jsonwebtoken');

var mysql= require('mysql');
var session = require('express-session');

//database connectivity
var dbconfig = require('../config/database');
var connection = mysql.createConnection(dbconfig.connection);

var pendingPOForSupplier=function(req,res,next){
  var secret="supersecret";
   var array=[];
   var quantityArray=[];
   var qualityArray=[];
   var POIdArray=[];
   var priceArray=[];


	console.log(req.session.token);
	jwt.verify(req.session.token, secret, function(err, decoded){
		if(err){
			console.log(req.headers.authorization)
			console.log("%%%%%%%%%%%%%%%%%%%" + err);
			return res.render('login',{success:false,msg:'session expired Login again'});
		}
		var userId =  decoded.id;
		var id = userId;

			
     connection.connect(function(err){
    console.log("Connected from pendingpo");
    connection.query(" select * from purchaseorder where supplierId='"+userId+"'",function(err,result,fields){

    for(var i=0;i<result.length;i++)
          {
            qualityArray.push([]);
            quantityArray.push([]);
            POIdArray.push([]);
            priceArray.push([]);
        }


  var sql="select * from pomultiple where POId IN (";
 for(i=0;i<result.length;i++){

       var sql= sql+result[i].POId+",";
         }       
         sql=sql.slice(0,-1);
         sql=sql+")"; 
         console.log(sql);
        connection.query(sql,function(err,results){
			console.log(results);


             for(var i=0;i<result.length;i++)
            {
               
             for(var j=0;j<results.length;j++){

                 if(results[j].POId==result[i].POId){
                 
                     quantityArray[i].push(results[j].Quantity);
                     qualityArray[i].push(results[j].Quality);
                     POIdArray[i].push(results[j].POId);
                     priceArray[i].push(results[j].price);
                   }
                              
           }
          }
          console.log(qualityArray);
          console.log(quantityArray);
          console.log(POIdArray);
          console.log(priceArray);


			for(var i=0;i<result.length;i++){
            array[i]={
                        "requestedByCompany":result[i].requestedByCompany,
                        "generationDate":result[i].generationDate,
                        "customerSite":result[i].customerSite,
                        "validTill":result[i].validTill,
                        "confirmedBySupplier":result[i].confirmedBySupplier,
                        "quality":qualityArray[i],
                        "quantity":quantityArray[i],
                        "POIdArray":POIdArray[i],
                        "price":priceArray[i],
                        "POId":result[i].POId

            }
            console.log(array[i]);
       }
     

            	res.render('order-tables',{result:array});
		    })
	    })
    });
  });
}

var confirmPendingPOBySupplier=function(req,res,next){
 var secret="supersecret";
  console.log(req.session.token);
  jwt.verify(req.session.token, secret, function(err, decoded){
  if(err){
      console.log(req.headers.authorization)
      console.log("%%%%%%%%%%%%%%%%%%%" + err);
      return res.render('login',{success:false,msg:'session expired Login again'});
    }
    var userId =  decoded.id;
  
    var id = req.body.POId;
    console.log(id);

    //PO.confirmPOBySupplier(id, function(err, po){
      
    connection.connect(function(err){
    console.log("Connected from confirmPOBySupplier");
    connection.query(" update purchaseorder set confirmedBySupplier='true' where POId='"+id+"'",function(err,result,fields){

      if(err){
        res.json({
          success:false,
          msg:"some error occured"
        })
        return;
      };
      // res.json({
      //  success:true
      // })
             res.redirect('/users/pendingpo');
    })
  })
});
}

//From here function of application side api will work

var indexCreatePO=function(req,res,next){
const secret = "supersecretkey";
jwt.verify(req.headers.authorization, secret, function(err, decoded){
        if(err){
            //console.log("%%%%%%%%%%%%%%%%%%%" + err);
            res.json({
                msg:"some error occured"
            })
            return;
        }
         if(Array.isArray(req.body.quality)){
         var quality=[];
         var quantity=[];
         var price=[];
         var remQuantity=[];
       }
        var userId =  decoded.id;

        var generationDate = Date.now();
        var validTill = req.body.validTill;
        var quantity = req.body.quantity;
        var quality = req.body.quality;
        var price = req.body.price;
        var customerSite = req.body.customerSite;
        var requestedBy = req.body.requestedBy;
        var requestedById = userId;
        var company = req.body.companyName;
        var remQuantity = req.body.quantity;
        var supplierId = req.body.supplierId;
        console.log(company);
        
        var newPO = ({
            generationDate : generationDate,
            validTill : validTill,
            quantity : quantity,
            quality : quality,
            price : price,
            remQuantity: remQuantity,
            customerSite : customerSite,
            requestedBy : requestedBy,
            requestedById : requestedById,
            supplierId : supplierId,
            requestedByCompany: company,
            confirmedBySupplier:false
        });

        //PO.createPO(newPO, function(err, PO){
        
     connection.connect(function(err){
       console.log(quality.length);
   console.log("Connected form createPO");

    var sql="Insert into purchaseorder(generationDate,validTill,customerSite,requestedBy,requestedById,supplierId,requestedByCompany,confirmedBySupplier) values('"+newPO.generationDate+"','"+newPO.validTill+"','"+newPO.customerSite+"','"+newPO.requestedBy+"','"+requestedById+"','"+newPO.supplierId+"','"+newPO.requestedByCompany+"','"+newPO.confirmedBySupplier+"')";
    connection.query(sql,function(err,result,fields){
      if(err){
                return handleError(err, null, res);
            }
   
   if(Array.isArray(req.body.quality)){
    for(var i=0;i<quality.length;i++)
    {  
    
      var sql="Insert into pomultiple(quantity,quality,price,POId,remQuantity) values('"+newPO.quantity[i]+"','"+newPO.quality[i]+"','"+newPO.price[i]+"','"+result.insertId+"','"+newPO.remQuantity[i]+"')";
         connection.query(sql,function(err,results,fields){
      if(err)
      {
         return handleError(err, null, res);
      }

        });

   }
 }
 else{


var sql="Insert into pomultiple(quantity,quality,price,POId,remQuantity) values('"+newPO.quantity+"','"+newPO.quality+"','"+newPO.price+"','"+result.insertId+"','"+newPO.remQuantity+"')";
         connection.query(sql,function(err,results,fields){
      if(err)
      {
         return handleError(err, null, res);
      }

        });



 }

 })
 
            
            res.json('PO created');
        
    });
});
}

var indexDeletePO=function(req,res,next){
  const secret = "supersecretkey";
 jwt.verify(req.headers.authorization, secret, function(err, decoded){
        if(err){
            //console.log("%%%%%%%%%%%%%%%%%%%" + err);
            res.json({
                msg:"some error occured"
            })
            return;
        }
        var userId =  decoded.id;

        var id = req.body.id;

      //  PO.deletePOByContractor(id, function(err, po){
            
     connection.connect(function(err){
    console.log("Connected form deletepo");
    var sql="update purchaseorder set deletedByContractor='true' where POId='"+id+"'";
    connection.query(sql,function(err,result,fields){
           if(err){
                return handleError(err, null, res);
            }
            res.json({
                success:true,
                msg: 'the PO has been deleted'
            })
        });
    });
});
}

var indexShowPO=function(req,res,next){
  const secret = "supersecretkey";
    jwt.verify(req.headers.authorization, secret, function(err, decoded){
        if(err){
            //console.log("%%%%%%%%%%%%%%%%%%%" + err);
            res.json({
                msg:"some error occured"
            })
            return;
        }
        var userId =  decoded.id;

       // PO.findPoByContractor(userId, function(err, pos){
            var senddata=[];
            var array=[];
            
                connection.connect(function(err){
          console.log("Connected form findPoByContractor");
         // var sql="select * from purchaseorder where requestedById='"+userId+"'";
  var sql="select generationDate,validTill,customerSite,requestedBy,requestedById,supplierId,requestedByCompany,confirmedBySupplier,POId,deletedByContractor from purchaseorder where requestedById='"+userId+"'";
      connection.query(sql,function(err,result,fields){
         if(err){
                return handleError(err, null, res);
            }
            else{
              //to initialize array of array
              for(var i=0;i<result.length;i++){
                array.push([]);
              }
     
    
       if(result.length<=0){
      return    res.json({
          success:true,
          data:[]
        })
       }
       else{

      var sql="select * from pomultiple where POId IN ( ";
      for(i=0;i<result.length;i++){
       var sql= sql+result[i].POId+",";
         }
         sql=sql.slice(0,-1);
         sql=sql+") order by POId";

      connection.query(sql,function(err,results,fields){
         if(err){
              throw err;
            }
           // console.log(results);
           else{
           for(i=0;i<result.length;i++)
            {
               
             for(var j=0;j<results.length;j++){

                 if(results[j].POId==result[i].POId){
                 
                       array[i].push(results[j]);
                   }      
            }
        }

             console.log(array);
             console.log(array[10]);
        

            for(var i=0;i<result.length;i++){
                  senddata[i]={
                     "generationDate":result[i].generationDate,
                     "validTill":result[i].validTill,
                     "customerSite":result[i].customerSite,
                     "requestedBy":result[i].requestedBy,
                     "requestedById":result[i].requestedById,
                     "supplierId":result[i].supplierId,
                     "requestedByCompany":result[i].requestedByCompany,
                     "confirmedBySupplier":result[i].confirmedBySupplier,
                     "POId":result[i].POId,
                     "deletedByContractor":result[i].deletedByContractor,
                     "values":array[i]

                }
}

            res.json({
                success:true,
                data:senddata
             })
            }
 });

          }

}
        });
    });
});
  }




module.exports={
  pendingPOForSupplier:pendingPOForSupplier,
  confirmPendingPOBySupplier:confirmPendingPOBySupplier,
  indexCreatePO:indexCreatePO,
  indexDeletePO:indexDeletePO,
  indexShowPO:indexShowPO
  };