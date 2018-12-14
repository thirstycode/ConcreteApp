var jwt = require('jsonwebtoken');

var mysql= require('mysql');
var session = require('express-session');

//database connectivity
var dbconfig = require('../config/database');
var connection = mysql.createConnection(dbconfig.connection);

//this function will separate all the quotations in two array on the basis of whether the supplier responded on the quote or not
var QuotesForSupplier=function(req,res,next){
	var secret="supersecret";


  console.log(req.session.token);
	jwt.verify(req.session.token, secret, function(err, decoded){
	if(err){
			console.log("%%%%%%%%%%%%%%%%%%%" + err);
			return res.render('login',{success:false,msg:'session expired Login again'});
		}
		var userId = decoded.id;
		
	console.log("about to call the function");
		
		//initialize all arrays
		var quantityArray=[];
		var qualityArray=[];
		var result=[];
    var responsesArray=[];
    var idArray=[];
    var priceArray=[];
    var priceresponse=[];
    var array=[];
      
      connection.connect(function(err){
          console.log("Connected from isAuthenticated");
  // connection.query("SELECT * FROM quotes INNER JOIN responses ON quotes.requestedById=responses.userId where quotes.requestedById='"+userId+"'",function(err,result,fields){
   //connection.query("SELECT * FROM responses where userId='"+userId+"'",function(err,result,fields){
  connection.query("select * from quotes order by quoteId",function(err,result1,fields){
  if(err){
			return res.json({
				success:false,
				msg:"there was some error retrieving the quotes"
			})
		}
	

   for(var i=0;i<result1.length;i++){

     quantityArray.push([]);
     qualityArray.push([]);
     responsesArray.push([]);
     idArray.push([]);
     array.push([]);
     priceArray.push([]);
     priceresponse.push([]);
     
    }

      var sql="select quantity,quality,quoteId from multipledata order By quoteId ";
      connection.query(sql,function(err,result3,fields){
      //  console.log(result3);
         if(err) throw err;
             else{
          
            for(i=0;i<result1.length;i++)
            {
               
             for( j=0;j<result3.length;j++){

                 if(result3[j].quoteId==result1[i].quoteId){
                 
                     quantityArray[i].push(result3[j].quantity);
                     qualityArray[i].push(result3[j].quality);
                   }
                              
           }
    }
} 
//  console.log(qualityArray);
// console.log(quantityArray);

         //from index.js we have to make a result and then pass in for each loop
        var sql="select * from responses";
       connection.query(sql,function(err,results,fields){
       // console.log(results);
         if(err) throw err;
             else{
            for(i=0;i<result1.length;i++)
            {
               
             for(var j=0;j<results.length;j++){

                 if(results[j].quoteId==result1[i].quoteId){
                 
                   
                     array[i].push(results[j]);
                   }
                 else {    
                  array.push([]);  
                }
                            
                         }
                        }                

if(results.length>0){

 //      var sql="select * from responses where rmxId='"+userId+"' && quoteId IN ( ";
        var sql="select * from responses where quoteId IN ( ";
      for(i=0;i<result1.length;i++){
       var sql= sql+result1[i].quoteId+",";
         }
         sql=sql.slice(0,-1);
         sql=sql+") group BY quoteId";
         console.log(sql);
     
       connection.query(sql,function(err,result14,fields){
       // console.log(result14);

                   


var sql="select price,id,quoteId from pricetable where id IN (";
    for(i=0;i<results.length;i++){

       var sql= sql+results[i].id+",";
         }       
         sql=sql.slice(0,-1);
         sql=sql+") order by id"; 
         console.log(sql);
      connection.query(sql,function(err,result13,fields){
         if(err) throw err;
         else{

               // console.log(result13);
                for(var j=0;j<result13.length;j++){
                 for(var i=0;i<result14.length;i++){

                      if(result14[i].quoteId==result13[j].quoteId){
                          priceArray[i].push(result13[j].price);
                           idArray[i].push(result13[j].id);
                      }
                
                    }
                   }
                }                    
               //console.log(priceArray);
               //console.log(idArray);

for(var i=0;i<priceArray.length;i++){
priceresponse[i]={

"prices":priceArray[i],
"id":idArray[i]
  }
}
console.log(priceresponse[0]);

  

           for(i=0;i<result1.length;i++){
           result[i]={
                   "quantity":  quantityArray[i],
                   "quality":   qualityArray[i],
                   "customerSite": result1[i].customerSite,
                   "generationDate": result1[i].generationDate,
                   "requiredDate": result1[i].requiredDate,
                   "requestedBy": result1[i].requestedBy,
                   "requestedByCompany": result1[i].requestedByCompany,
                   "requestedById": result1[i].requestedById,
                   "quoteId": result1[i].quoteId,
                    "price":priceresponse[i],
                   "responses": array[i],
                   "id":userId
                 }
  
             } 
         

        console.log("quotes returnded");
    		console.log(result);

		
		var aQuotes = [];//contain quotes that rmx supplier has already responded to
		var uQuotes = [];//contain quotes that rmx supplier can respond to
	      //error here- cannot read property foreach of undefined
	       result.forEach((quote) => {
	
			var flag = true;
	
			quote.responses.forEach((response) => {
				
				console.log(response.rmxId);
				
				if(response.rmxId == userId)
        {
					flag = false;
				
				}
			})
			
      if(flag)
      {
					uQuotes.push(quote);
			}
      else{
		
				aQuotes.push(quote);
		   	}
		
    	})

	
		console.log("about to send response");
		res.render('index-tables',{sucess:true,aQuotes:aQuotes,uQuotes:uQuotes});

   	          })
     	      })
          }
          } 
        })
      })
    });
  });
});
}


var RemoveQuoteBySupplier=function(req,res,next){
var secret="supersecret";

  if(req.session){
  console.log(req.body.quoteId);
  console.log(req.body.responseId);
  var quoteId = req.body.quoteId;
  var responseId = parseInt(req.body.responseId);

      
       console.log(quoteId);
       console.log(responseId);
    connection.connect(function(err){
    console.log("Connected form respond to quotes");
    var sql="select * from responses where quoteId='"+quoteId+"'";
    connection.query(sql,function(err,result1,fields){
     if(err) throw err;
     else{
      console.log(result1);
      console.log(result1.length);
       if(result1.length==1)
       {
      
        var sql=" update pricetable set price=NULL where quoteId='"+quoteId+"' && id='"+responseId+"'";
        connection.query(sql,function(err,result2,fields){
        if(err) throw err;
        else{
        
        var sql=" update responses set rmxId=NULL,validTill=NULL where quoteId='"+quoteId+"' && id='"+responseId+"'";
        connection.query(sql,function(err,result3,fields){
         if(err) throw err;
       
                });
              }
           });


      }
      else{
         
                var sql=" delete from pricetable where quoteId='"+quoteId+"' && id='"+responseId+"'";
        connection.query(sql,function(err,result2,fields){
        if(err) throw err;
        else{
        
      var sql="delete from responses where quoteId='"+quoteId+"' && id='"+responseId+"'";
        connection.query(sql,function(err,result3,fields){
         if(err) throw err;
       
                });
              }
           });
       }
    }
  
          res.redirect('/users/tables');
      })
    })
  }
  else{
  return res.render('login',{success:false,msg:'session expired Login again'});
  }
}

//From here function of app side will start
var indexRequestQuote=function(req,res,next){
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
          //console.log(a.quality);
           console.log(userId);

//defining arrays
        var quality = [];
        var quantity = [];
        
        console.log(req.body.quality);
         console.log(req.body.quantity);
          console.log(req.body.customerSite);
           console.log(req.body.requiredDate);
           console.log((req.body.quality).length);
            console.log(Array.isArray(req.body.quality));
       
       var quality = req.body.quality;
        var quantity = req.body.quantity;
        var customerSite = req.body.customerSite;
        var generationDate =  Date.now();
        var requiredDate = req.body.requiredDate;
        var requestedBy = req.body.name;
        var requestedById = userId;
        var companyName = req.body.company;

       req.checkBody('quantity', 'quantity cannot be empty').notEmpty();
        req.checkBody('quality', 'quality cannot be empty').notEmpty();
        req.checkBody('customerSite', 'customerSite cannot be empty').notEmpty();
        req.checkBody('requiredDate', 'requiredDate cannot be empty').notEmpty();

        var errors = req.validationErrors();
        console.log(errors);
        
        if(errors){
            return handleError(errors, null, res);
        }else{
             var newQuote = (
              {
                quantity : quantity,
                quality : quality,
                customerSite : customerSite,
                generationDate : generationDate,
                requiredDate : requiredDate,
                requestedBy : requestedBy,
                requestedByCompany: companyName,
                requestedById : requestedById
            });
                 console.log(newQuote.quantity[0]);

           console.log(quality.length);
           connection.connect(function(err){
         
          //console.log(newQuote[0].quantity);
          //if(err) throw err;
        
         console.log("Connected form requestquote");
        var sql="Insert into quotes(customerSite,generationDate,requiredDate,requestedBy,requestedByCompany,requestedById) values('"+newQuote.customerSite+"','"+generationDate+"','"+newQuote.requiredDate+"','"+newQuote.requestedBy+"','"+newQuote.requestedByCompany+"','"+requestedById+"')";
        connection.query(sql,function(err,result,fields){
          console.log(result);
              console.log(result.insertId);
            if(err) throw err;
        else{
//we are inserting in response table and price table but price and rmxId and validTill will be null. In user.js we will update these values on response of user.
        // this is done to show multiple responses in quotes 
        var sql="insert into responses (quoteId,userId) Values('"+result.insertId+"','"+requestedById+"')";
         connection.query(sql,function(err,result2,fields){
          console.log(result2);
            if(err) throw err;
            
        if(Array.isArray(req.body.quality))
    {

          for(  var i=0;i<quality.length;i++){
       //forimplementing multiple price quality and quantity . It will make null price as number of times as quality present
        var sql="insert into pricetable (quoteId,id) Values('"+result.insertId+"','"+result2.insertId+"')";
         connection.query(sql,function(err,result3,fields){
          console.log(result3);
            if(err) throw err;
          });

         var sql="Insert into multipledata(quoteId,quantity,quality) values('"+result.insertId+"','"+newQuote.quantity[i]+"','"+newQuote.quality[i]+"')";
         connection.query(sql,function(err,result1,fields){

                  if(err){
                  return handleError(err, null, res);
              }
      });


            }
      }
      else{


          var sql="insert into pricetable (quoteId,id) Values('"+result.insertId+"','"+result2.insertId+"')";
         connection.query(sql,function(err,result3,fields){
          console.log(result3);
            if(err) throw err;
          });

         var sql="Insert into multipledata(quoteId,quantity,quality) values('"+result.insertId+"','"+newQuote.quantity+"','"+newQuote.quality+"')";
         connection.query(sql,function(err,result1,fields){

                  if(err){
                  return handleError(err, null, res);
              }
      });


      }  
          
          });
                res.json({
                    success:true,
                    msg: 'new request for quote submitted for ' + newQuote.quantity[0] + ' of ' + newQuote.quality[0]  + ' quality redimix.'
                });
           
 
        }
         });
   })

}
})
}

var indexCancelQuote=function(req,res,next){
 
 var quoteId = req.body.quoteId;
    console.log(quoteId);
    //console.log(req.body);
        connection.connect(function(err){
        
          console.log("Connected form cancelquote");
          connection.query("delete from quotes where quoteId='"+quoteId+"'",function(err,result,fields){
        if(err){
            return handleError(err, null, res);
        }
        res.json({
            success:true,
            msg:" quote has been cancelled"
        })
    })
});
  }

module.exports={
  QuotesForSupplier:QuotesForSupplier,
  RemoveQuoteBySupplier:RemoveQuoteBySupplier,
  indexRequestQuote:indexRequestQuote,
  indexCancelQuote:indexCancelQuote

};
