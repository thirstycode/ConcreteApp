var express = require('express');
var router = express.Router();
var mysql=require('mysql');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var secret="supersecret";

var dbconfig=require('../config/database');
var connection=mysql.createConnection(dbconfig.connection);







//connection is done once for mysql
 connection.connect(function(err){



/* GET home page. */
router.get('/', isAuthenticated, function(req, res, next){
    console.log(res.locals);
    // getAllUserDashboardDetails(req, res, res.locals.userId);
    res.json({
      success:true
    })
    
});

//for getting signup page
// router.get('/signup', function(req, res, next){
//     res.render('signup');
// });



router.post('/checkmobile',function(req,res,next){

 var contact=req.body.contact.slice(2-12);

connection.query("select contact from driver",function(err,result,fields){
if(err) throw err;
else{
for(var i=0;i<result.length;i++)
{
    if(contact==result[i].contact)
    {
      console.log("mobile number" +contact + "already exist");
     return res.json({
        success:true,
      msg:'mobile number already exist'
     });
    }

}
console.log("mobile number" +contact+ "does not exist");
res.json({

  msg:'mobile number does not exist'
})

  }

})

});



router.post('/updatemobile',function(req,res,next){
console.log("POST /updatemobile");
jwt.verify(req.headers.authorization, secret, function(err, decoded){
    if(err){
      console.log(req.headers.authorization)
      console.log("%%%%%%%%%%%%%%%%%%%" + err);
      res.json({
        success:false,
        msg:"some error occured"
      })
      return;
    }
    var driverId = decoded.id;



 var contact=req.body.contact.slice(2-12);

connection.query("update driver set contact='"+contact+"' where driverId='"+driverId+"'",function(err,result,fields){
if(err) throw err;
console.log("Connected from updatemobile");
})

res.json({
  success:true,
  msg:'mobile updated'
})

})
});




// api for login
router.post('/login',function(req,res,next){

 var contact=req.body.contact;
 var pin=req.body.pin;

console.log(typeof(req.body.contact));
console.log(contact);
console.log(pin);
 connection.query("select * from driver where contact='"+contact+"'",function(err,result,fields){
  if (err) {
     return handleError(err, null, res);
   }
  else{

        if(result.length<=0)
        {
        	 console.log("user with contact number: " +contact+ " does not exist");
           msg="user with contact number does not exist";
           return handleError(null,msg,res);
        }
        console.log(result[0].pin);
           
        
         bcrypt.compare(pin, result[0].pin , function(err, isMatch){
			       if(err){
                    return handleError(err, null, res);
                }
                if(!isMatch){
                    return handleError(null, "wrong password", res);
                }
                jwt.sign({id: result[0].driverId}, secret, function(err, token){
                    if(err)handleError(err, null, res);
                res.json({
                     success:true,
                     token:token

                });
            });
        }) 
     }
   })
});






//this api is for driverApp side signup
router.post('/register',function(req,res,next){

   var name=req.body.name;
   var email=req.body.email;
   var pin = req.body.pin;
   var contact=req.body.contact.slice(2-12);
   var bloodGroup=req.body.bloodgroup;


   // var contact2=req.body.contact.slice(2-12);
   // console.log(contact2);

  req.checkBody('name','Name cannot be empty').notEmpty();
  req.checkBody('email','Email cannot be empty').notEmpty();
  req.checkBody('email', 'Enter a valid email').isEmail();
  req.checkBody('pin','password cannot be empty').notEmpty();

 var errors=req.validationErrors();
 console.log(errors);
 if (errors){

 	return handleError(errors,null,res);
 }
 else{

 var newDriver= ({
       name:name,
       email:email,
       pin:pin,
       contact:contact, 
       bloodGroup:bloodGroup
 });

     
       bcrypt.hash(newDriver.pin, 10, function(err, hash){
        if(err)throw err;
        newDriver.pin = hash;


            
   var sql="Insert into driver ( name , email , contact,pin,bloodGroup) values('"+newDriver.name+"','"+newDriver.email+"','"+newDriver.contact+"','"+newDriver.pin+"','"+newDriver.bloodGroup+"')";
   connection.query(sql,function(err,result){
      if(err) throw err;
           

           res.json({
                    success:true,
                    msg: 'user created'
                });

           });

        });
    }

})




router.get('/profile', function(req,res){

    jwt.verify(req.headers.authorization, secret, function(err, decoded){
        if(err){
            //console.log("%%%%%%%%%%%%%%%%%%%" + err);
            res.json({
                msg:"some error occured"
            })
            return;
        }
        var driverId =  decoded.id;
    
     
    console.log("Connected form profile");
    connection.query("select * from driver where driverId='"+driverId+"'",function(err,result,fields){
 
            if(err){
                return handleError(err, null, res);
            }
            res.json({
                success:true,
                user:result[0]
            });

        });
    });
});





//this route is called as POST when profile change is required
router.post('/profile', function(req, res){

    jwt.verify(req.headers.authorization, secret, function(err, decoded){
        if(err){
            //console.log("%%%%%%%%%%%%%%%%%%%" + err);
            res.json({
                msg:"some error occured"
            })
            return;
        }
        var driverId =  decoded.id;

    
        var id = driverId;
        var name = req.body.name;
        var email = req.body.email;
        var bloodgroup=req.body.bloodgroup;
       // var contact = req.body.contact;

//no need to check for id
  
        req.checkBody('name', 'Name cannot be empty').notEmpty();
        req.checkBody('email', 'Email cannot be empty').notEmpty();
        //req.checkBody('contact', 'contact cannot be empty').notEmpty();
        req.checkBody('email', "Enter a valid email").isEmail();
        
        var errors = req.validationErrors();

        if(errors){
           
            return handleError(errors, null, res);
        }else{
		    
		    console.log("Connected form edit profile");
		  
			    var sql="update driver SET name='"+name+"', email='"+email+"',bloodgroup='"+bloodgroup+"' where driverId='"+id+"'";
			   console.log(sql);
          connection.query(sql,function(err,result,fields){
			        if(err){
                        handleError(err, null, res);
                    }
                    res.json({
                        success:true,
                        user:result
                    })
                });
           
         }
     });
});



router.post('/changepin', function(req, res){
	var oldpin = req.body.oldpin;
	var newpin = req.body.newpin;
	// var newpin2 = req.body.newpin2;
console.log(oldpin);
console.log(newpin);
	jwt.verify(req.headers.authorization, secret, function(err, decoded){
		if(err){
			console.log(req.headers.authorization)
			console.log("%%%%%%%%%%%%%%%%%%%" + err);
			res.json({
				success:false,
				msg:"some error occured"
			})
			return;
		}
		var driverId = decoded.id;
console.log(driverId);

    console.log("Connected from changepin");
    connection.query("select * from driver where driverId='"+driverId+"'",function(err,result,fields){
			if(err){
				handleError(err, '', res);
				return;
			}
			bcrypt.compare(oldpin, result[0].pin, function(err, match) {
				if(!match){
					res.json({
						success:false,
						msg:'old pin is not correct'
					});
					return;
				}
		
				bcrypt.hash(newpin, 10, function(err, hash){
					if(err){
						handleError(err, '', res);
						return;
					}
					result[0].pin = hash;
					//user.save();
					  connection.query("update driver SET pin='"+result[0].pin+"' where driverId='"+driverId+"'",function(err,result,fields){
                       if(err) throw err;

                     
					res.json({
						success:true,
						msg:'pin updates successfully'
					});
				});
			});
		})
	});
});
});
	




//Api for Providing site lat long 
router.get('/navigation', function(req, res){
 jwt.verify(req.headers.authorization, secret, function(err, decoded){
   if(err)
   {
       console.log(req.headers.authorization)
       console.log("%%%%%%%%%%%%%%%%%%%" + err);
       res.json({
       success:false,
       msg:"some error occured"
        })
      return;
   }
   var driverId = decoded.id;
   var date=new Date();
   console.log(driverId);

connection.query("select * from driver where driverId='"+driverId+"'",function(err,result1,fields){
  if(err) throw err
    else{
    console.log(result1);
    if(result1[0].supplierId!=null){

connection.query("select * from dispatchorder where drivercontact='"+result1[0].contact+"'",function(err,result2,fields){
if(err) throw err;
else{
  console.log(result2);
  console.log(result2.length-1);
 if(result2.length>0){

 var sql="select * from orders where orderId='"+result2[result2.length-1].orderId+"'"; 
connection.query(sql,function(err,result3,fields){
if(err) throw err;
else{

console.log(result3)

var sql2="select * from customersite where customerSiteId='"+result3[result3.length-1].customerSiteId+"'"; 
connection.query(sql2,function(err,result4,fields){
if(err) throw err;
else
{
   console.log(result4);

  
    res.json({
    success:true,
     lat:result4[0].lat,
     lon:result4[0].lon

         })

       }
    })
  }
 });
}
 else{
      res.json({
      success:false,
     msg:"No Order Found"

     }) 
    }


}


})
}
// else for no supplier
else{

     res.json({
      success:false,
     msg:"No Supplier Found"

     })

    }
}
    })

  })
});












// router.post('/qrcode', function(req, res){
 

// 	jwt.verify(req.headers.authorization, secret, function(err, decoded){
// 		if(err){
// 			console.log(req.headers.authorization)
// 			console.log("%%%%%%%%%%%%%%%%%%%" + err);
// 			res.json({
// 				success:false,
// 				msg:"some error occured"
// 			})
// 			return;
// 		}
// 		var driverId = decoded.id;


// connection.query("select * from driver where driverId='"+driverId+"'",function(err,result1,fields){
// if (err) throw err;



// var totalQuantity=req.body.totalQuantity;
// var orderedQuantity=req.body.orderedQuantity;
// var quality = req.body.quality;
// var customerName=req.body.customerName;
// var supplierId=req.body.supplierId;
// var date=Date.now();

// var result=({
//     totalQuantity:totalQuantity,
//     orderedQuantity:orderedQuantity,
//     quality:quality,
//     customerName:customerName,
//     supplierId:supplierId,
//     date:date

// });

// connection.query("select * from driverdetails where contact='"+result1[0].contact+"'",function(err,result2,fields){ 
//          if(err) throw err;
//          else{
               
//                  connection.query("select * from dispatchorder where driverContact='"+result2[0].contact+"' && supplierId='"+result2[0].supplierId+"' group by dispatchId)";
//          }


// var s="totalQuantity='"+totalQuantity+"'orderedQuantity='"+orderedQuantity+"'quality='"+quality+"'customerName='"+customerName+"'supplierId='"+supplierId+"'date of dispatch='"+date+"''";


// });


// });
// });


router.get('/qrcode', function(req, res){
var qualityArray=[];
var quantityArray=[];
var totalQuantityArray=[];


 jwt.verify(req.headers.authorization, secret, function(err, decoded){
   if(err)
   {
       console.log(req.headers.authorization)
       console.log("%%%%%%%%%%%%%%%%%%%" + err);
       res.json({
       success:false,
       msg:"some error occured"
        })
      return;
   }
   var driverId = decoded.id;
   var date=new Date();
   console.log(driverId);

connection.query("select * from driver where driverId='"+driverId+"'",function(err,result1,fields){
  if(err) throw err
    else{
    console.log(result1);
    if(result1[0].supplierId!=null){

connection.query("select * from dispatchorder where drivercontact='"+result1[0].contact+"'",function(err,result2,fields){
if(err) throw err;
else{
  console.log(result2);
  console.log(result2.length-1);
 if(result2.length>0){

 var sql="select * from orders where orderId='"+result2[result2.length-1].orderId+"'"; 
connection.query(sql,function(err,result3,fields){
if(err) throw err;
else{

console.log(result3)

var sql2="select * from ordermultiple where orderId='"+result2[result2.length-1].orderId+"'"; 
connection.query(sql2,function(err,result4,fields){
if(err) throw err;
else
{

    for(var i=0;i<result4.length;i++)
          {
            qualityArray.push(result4[i].quality);
            quantityArray.push(result4[i].quantity);
        }

var sql3="select * from pomultiple where POId='"+result3[0].POId+"'"; 
connection.query(sql3,function(err,result5,fields){
if(err) throw err;
else
{

      for(var j=0;j<result5.length;j++)
      {
          totalQuantityArray.push(result5[j].Quantity);
      }




var string="Total Quantity= '"+totalQuantityArray+"    'Ordered Quantity= '"+quantityArray+"    'Quality= '"+qualityArray+"    'Customer Name= '"+result3[0].requestedBy+"   'supplierId=  '"+result3[0].supplierId+"  'Date of dispatch= '"+date+"''";
console.log(string);
  
    res.json({
    success:true,
    msg:string

         })

       }
    })
  }
 });
}
  })
}

else{
      res.json({
      success:false,
     msg:"No Order Found"

     }) 
    }
}
})
}
// else for no supplier
else{

     res.json({
      success:false,
     msg:"No Supplier Found"

     })

    }
}
    })

  })
});

/*
 connection.query("select * from driver where driverId='"+driverId+"'",function(err,result1,fields){
if (err) throw err;

connection.query("select * from driverdetails where contact='"+result1[0].contact+"'",function(err,result2,fields){ 
         if(err) throw err;
         else{
               
         connection.query("select * from dispatchorder where driverContact='"+result2[0].contact+"' && supplierId='"+result2[0].supplierId+"' order by dispatchId",function(err,result3,fields){
           if(err) throw err;

         })
         }


var s="totalQuantity='"+totalQuantity+"'orderedQuantity='"+orderedQuantity+"'quality='"+quality+"'customerName='"+customerName+"'supplierId='"+supplierId+"'date of dispatch='"+date+"''";
*/
//inner join on three tables. If quality and quantity is taken from rmc site then total quantity will be taken from PO and POId from orderId
//SELECT * FROM driver INNER JOIN driverdetails ON driver.contact=driverdetails.contact INNER JOIN dispatchorder ON  dispatchorder.supplierId=driverdetails.supplierId && dispatchorder.drivercontact=driverdetails.contact WHERE driver.driverId=8 ORDER BY dispatchorder.dispatchId DESC ;

/*
});


});

var string="hello muskan";
res.json({
success:true,
msg:string

});
});
*/

}); //end brackets of connection





//this function checks if the user is in session or not
function isAuthenticated(req, res, next){
    console.log(req.headers['authorization']);
    if(req.headers['authorization']){
        jwt.verify(req.headers['authorization'], secret, function(err, decoded){
            if(err){
                console.log(err);
                return handleError(err, null, res);
            }
            res.locals.driverId = decoded.id;
            console.log("calling next now and " + res.locals.driverId);
            return next();
        })
    }else{
        res.json({
            success:false,
            auth:false,
            msg:"authentication unsuccessful, please login again"
        });
    }
}

//this function is a general error handler
function handleError(err, msg, res){
    console.log(err);
    if(msg == undefined){
        msg = "there was some error at the server"
    }
    return res.json({
        success:false,
        msg: msg,
        err:err
    })
}











module.exports = router;
