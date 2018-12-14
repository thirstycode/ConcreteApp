 var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var nodemailer = require('nodemailer');
//this is used for generating SVG Captchas
var svgCaptcha = require('svg-captcha');
var async = require('async');
var jwt = require('jsonwebtoken');
const secret = "supersecretkey";
var mysql= require('mysql');
var bcrypt = require('bcrypt');
//importing passport and its local strategy;
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var dbconfig = require('../config/database');
var connection = mysql.createConnection(dbconfig.connection);



var sendgridUser = process.env.SENDGRID_USERNAME;
var sendgridPass = process.env.SENDGRID_PASS;
//var LocalStrategy = require('passport-local').Strategy;




//for notification
router.post('/notification',function(req,res,next){
var notification=require('../app/Notification');
notification(req,res,next);
});




//These are all the get requests

/* GET home page. */
router.get('/auth', isAuthenticated, function(req, res, next){
    console.log(res.locals);
    getAllUserDashboardDetails(req, res, res.locals.userId);
    
});


function getAllUserDashboardDetails(req, res, userId, token){
    

    async.parallel({
        orders: function(callback) {
          
            var array=[];
            var result=[];
            connection.connect(function(err){
		    console.log("Connected from getAllOrderdByUserId");
		    //requestedById not here
		    var sql="select orderId,generationDate,requiredByDate,requestedBy,requestedById,supplierId,companyName,customerSite,POId,status,statusDate,statusDesc from orders where requestedById='"+userId+"'";
		    connection.query(sql,function(err,result1,fields){
		     if(err) throw err;
         else{


          for(var i=0;i<result1.length;i++){
                array.push([]);
              }
     
           if(result1.length<=0){
            result=[];
             callback(err,result);
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

  
           console.log(array);
		     
         callback(err,result);
		  
}

  });
}
}
       });
	   });
   },


            issues: function(callback) {
             connection.connect(function(err){
             //if(err) throw err;
		    console.log("Connected from getAllIssuesByUserId");
		    connection.query("select * from issues where userId='"+userId+"'",function(err,result,fields){
		     if(err) throw err;
		        callback(err,result);
		        });
	         });
        },

             
        
        quotes: function(callback){
        var quantityArray=[]; 
        var qualityArray=[];    
        var array=[];
         var array2=[];
         var result=[];
        var responsesArray=[];
       var idArray=[];
         var priceArray=[];
         var priceresponse=[];
         var i,j=0;

    connection.connect(function(err){
 

  connection.query("select * from quotes where requestedById='"+userId+"' order by quoteId",function(err,result1,fields){
  if(err) throw err;
  

  else{ 
 for(var i=0;i<result1.length;i++){

    quantityArray.push([]);
     qualityArray.push([]);
     array2.push([]);
    responsesArray.push([]);
    idArray.push([]);
    array.push([]);
 }

 if(result1.length<=0){
       result=[];

            callback(err,result);
 }
 
 else{

 var sql="select  * from multipledata where  quoteId IN (";
      for(i=0;i<result1.length;i++){
       var sql= sql+result1[i].quoteId+",";
         }
         sql=sql.slice(0,-1);
         sql=sql+")";
       connection.query(sql,function(err,result4,fields){
      console.log(quantityArray.length);

      var sql="select quantity,quality from multipledata where  quoteId IN (";
      for(i=0;i<result1.length;i++){
       var sql= sql+result1[i].quoteId+",";
         }
         sql=sql.slice(0,-1);
         sql=sql+")";

       connection.query(sql,function(err,result3,fields){
        // console.log(result3);
         if(err) throw err;
             else{
          
            for(i=0;i<result1.length;i++)
            {
               
             for( j=0;j<result3.length;j++){

                 if(result4[j].quoteId==result1[i].quoteId){
                 
                     quantityArray[i].push(result3[j].quantity);
                     qualityArray[i].push(result3[j].quality);
                   }
                              
           }
     }
            //console.log(quantityArray);


            }


console.log(quantityArray);




//var sql="select distinct * from responses where userId='"+userId+"' && quoteId IN (";
    
      var sql="select rmxId,validTill,quoteId,userId,id from responses where userId='"+userId+"' && quoteId IN ( ";
      for(i=0;i<result1.length;i++){
       var sql= sql+result1[i].quoteId+",";
         }
         sql=sql.slice(0,-1);
         sql=sql+")";
         console.log(sql);

       connection.query(sql,function(err,results,fields){
        // console.log(results);
         if(err) throw err;
             
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

       var sql="select rmxId,validTill,quoteId,userId,id from responses where userId='"+userId+"' && quoteId IN ( ";
      for(i=0;i<result1.length;i++){
       var sql= sql+result1[i].quoteId+",";
         }
         sql=sql.slice(0,-1);
         sql=sql+") GROUP BY quoteId";
        // console.log(sql);

       connection.query(sql,function(err,result14,fields){
         console.log(result14);



                   for(var i=0;i<result1.length;i++){
                          priceArray.push([]);
                            priceresponse.push([]);
                        }
                      


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

                console.log(result13);
              //  for(var k=0;k<result1.length;k++){} 
                for(var j=0;j<result13.length;j++){
                 for(var i=0;i<result14.length;i++){
                    

                     //if(result1[k].quoteId==result13[j].quoteId){

                      if(result14[i].quoteId==result13[j].quoteId){
                          priceArray[i].push(result13[j].price);
                           idArray[i].push(result13[j].id);
                      }
                    //   else{
                    //   priceArray[i].push([]);
                    //   idArray[i].push([]);
                    // }

                    }
                    // else{
                    //   priceArray[i].push([]);
                    //   idArray[i].push([]);
                    // }
                   }
                  
                // }   
               console.log(priceArray);
               console.log(idArray);

for(var i=0;i<priceArray.length;i++){
priceresponse[i]={

"prices":priceArray[i],
"id":idArray[i]
  }
}
console.log(priceresponse[0]);
}
  




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
                    "price": priceresponse[i],
                   "responses": array[i]
                 }
  
             } 

            callback(err,result);
          });
      });
  }
else{
  //else called
  for(i=0;i<result1.length;i++)
  {
  array[i]=[];
   priceresponse[i]=[];
  }


     

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
                    "price": priceresponse[i],
                   "responses": array[i]
                 }
  
             } 

		        callback(err,result);
          }
         

             })     


});
     }) 
 }


      

//for empty quotes

}

});
})
}
},



function(err, results) {
        // results is now equals to: {one: 1, two: 2}
       //console.log("hello");
        if(err){
            return handleError(err);
        }
        return res.json({
            success:true, 
            results:results,
            token:token

        })
    });
}
    


//These are all the POST requests

//POST for login
//this takes username, password and captcha
router.post('/login', function(req, res, next){

    //extracting all the info from request parameters
    var username = req.body.username;
    var password = req.body.password;
    //var captcha = req.body.captcha;
    //console.log(req);
    //checking all the form-data is right
    req.checkBody('username', 'please enter a valid username').isEmail();
    req.checkBody('password', 'please enter a valid password').notEmpty();
    //req.checkBody('captcha', 'Captcha is incorrect').equals(req.session.captcha);
    console.log('login hit');
    //console.log(req.body);
    //getting all the validation errors
    var errors = req.validationErrors();
    if(errors){
        res.send(errors)
    }else{
       
        console.log(username, password);
       
           connection.connect(function(err){
          
		    console.log("Connected from login");
		    //console.log("select * from user where email='"+username+"'");
		    connection.query("select *  from user where email='"+username+"'",function(err,result,fields){
		     if(err){
		     	console.log(err);
                return handleError(err, null, res);
            }

               console.log(result);

		     if(result.length<=0)
		     {
                console.log("user with username : " + username + " not found");
                msg = "user with this username does not exist";
                return handleError(null, msg, res);
            }
            
                 bcrypt.compare(password, result[0].password , function(err, isMatch){
			       if(err){
                    return handleError(err, null, res);
                }
                if(!isMatch){
                    return handleError(null, "wrong password", res);
                }
                jwt.sign({id: result[0].userId}, secret, function(err, token){
                    if(err)handleError(err, null, res);
                    return getAllUserDashboardDetails(req, res, result[0].userId, token);
                    
                })
			       
              });

        });

    });
   }
});


//this route is for creating new user
router.post('/signup', function(req, res, next){

var Signup=require('../app/Signup');
Signup.indexSignup(req,res,next);

});



router.post('/changepass', function(req, res,next){
	
  var Changepassword=require('../app/Changepassword');
  Changepassword.indexChangePassword(req,res,next);

});



router.get('/getcities', function(req, res,next){
    
   var Cities=require('../app/Cities');
   Cities.getCities(req,res,next);
  });

router.post('/addcity', function(req, res,next){
   var Cities=require('../app/Cities');
   Cities.addCity(req,res,next);

});

//this api will check for existing users
router.post('/doesexist', function(req, res,next){
var Userfunction=require('../app/Userfunction');
Userfunction.indexDoesExist(req,res,next);

  });



router.post('/getsuppliername', function(req, res,next){
var Userfunction=require('../app/Userfunction');
Userfunction.indexGetSupplierName(req,res,next);
});




//this route is used to add a customer site
router.post('/addsite', function(req, res,next){
var Customersite=require('../app/Customersite');
Customersite.addSite(req,res,next);
   
})


//this route deletes site from the site array in user document
router.post('/deletesite', function(req, res,next){
    //change this to pick userid from req header and site id  from req.body
var Customersite=require('../app/Customersite');
Customersite.deleteSite(req,res,next);
  
});

//this route returns the profile info of the current logged in user
router.get('/profile', function(req,res,next){

var Profile=require('../app/Profile');
Profile.indexGetProfile(req,res,next);

});

//this route is called as POST when profile change is required
router.post('/profile', function(req, res,next){
var Profile=require('../app/Profile');
Profile.indexPostProfile(req,res,next);
    
});



//this route returns all the order(cancelled as well as successful)
router.get('/history', function(req, res,next){

var Orders=require('../app/Orders');
Orders.indexHistory(req,res,next);

  });


//this is post for forgot password which requires user's email id
router.post('/forgot', function(req, res){
    var email = req.body.email;
    //sql connection
      connection.connect(function(err){
   //if(err) throw err;
   var sql="select * from user where email='"+email+"'";
   console.log(email);
   connection.query(sql,function(err,result){
       //console.log(result);
        if(err){
            return handleError(err, null, res)
        }
        if(result.length<0){
            return handleError(null, "no user with this username exists", res);
        }
        crypto.randomBytes(20, function(err, buf){
            if(err){
                return handleError(err, null, res);
            }
            var token = buf.toString('hex');
            result[0].resetPasswordToken = token;
            result[0].resetPasswordExpire = Date.now() + 3600000; //1hour
            console.log(result);
            //user.save(function(err){
               

		     connection.connect(function(err){
		   //if(err) throw err;
		   var sql="update user set resetPasswordExpire='"+result[0].resetPasswordExpire+"', resetPasswordToken='"+result[0].resetPasswordToken+"' where email='"+email+"'";
		   console.log(email);
		   connection.query(sql,function(err,result){

               
                if(err){
                    return handleError(err, null, res);
                }
            

            var smtpTransport = nodemailer.createTransport({
                service:'SendGrid',
                auth:{
                    user:'jarvis123',
                    pass:'abhansh@123'
                }
            });
            var mailOptions = {
                to:email,
                from:'passwordreset@demo.com',
                subject:'concrete password reset',
                text:'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                'http://' + req.headers.host + '/reset/' + token + '\n\n' +
                'If you did not request this, please ignore this email and your password will remain unchanged.\n'
            };
            smtpTransport.sendMail(mailOptions, function(err){
                if(err){
                    return handleError(err,"error me", res);
                }
                res.json({
                    success:true,
                    msg:"a mail has been sent to your registered mail id"
                });
            })
        })
    });
})
});
});
  });

//this route will verify the password token hasn't expire and returns a json response
router.get('/reset/:token', function(req, res) {
   // User.findOneForResetPassword(req.params.token, function(err, user) {
    
     connection.connect(function(err){
    console.log("Connected form resetpasswordget");
    connection.query("select * from user where resetPasswordToken='"+req.params.token+"' &  resetPasswordExpire <'"+Date.now()+"'",function(err,result,fields){
   if(err) throw err;

      if (result.length<=0) {
          var result = {
              err:true,
              msg:'Password reset token is invalid or has expired.'
          }
        return res.status(200).json(result);
      }
      var result = {
          msg:"reset your password", 
          user:result
      }
      res.status(200).json(result);
    });
});
 });

//POST for password reset and if token hasn't expired, the password of user is reset.
router.post('/reset/:token', function(req, res){
    //User.findOneForResetPassword(req.params.token, function(err, user){
        
    connection.connect(function(err){
    console.log("Connected form resetpasswordget");
    connection.query("select * from user where resetPasswordToken='"+req.params.token+"' &  resetPasswordExpire <='"+Date.now()+"'",function(err,result,fields){

        if(err){
            return handleError(err);
        }
        if(result.length<=0){
            var result = {
                msg:"this token has expired"
            }
            return res.status(200).json(result);
        }
        result[0].password = req.body.password;
        result[0].resetPasswordExpire = undefined;
        result[0].resetPasswordToken = undefined;

        //User.saveUserResetPassword(user, function(err){
          
        bcrypt.hash(result[0].password, 10, function(err, hash){
        if(err)throw err;
        result[0].password = hash;
        //user.save(callback); 
          
             connection.query("update user set password='"+result[0].password+"',resetPasswordToken='"+result[0].resetPasswordToken+"' &  resetPasswordExpire='"+result.resetPasswordExpire+"' where email='"+result[0].email+"'",function(err,result,fields){

            if(err){
                return handleError(err, null, res);
            }
            //previous user in place of result in below line 
            req.logIn(result, function(err){
                res.status(200).json("password has been reset successfully");
            });
        });
    });
});
});
});



router.post('/requestquote', function(req, res,next){
var Quotations=require('../app/Quotations');
Quotations.indexRequestQuote(req,res,next);

});

//this route will cancel an existing quote that was created by contractor
router.post('/cancelquote', function(req, res,next){
  var Quotations=require('../app/Quotations');
Quotations.indexCancelQuote(req,res,next);
   
});

//this route will create a purchase order between contractor and supplier
router.post('/createpo', function(req, res,next){
var Purchaseorders=require('../app/Purchaseorders');
Purchaseorders.indexCreatePO(req,res,next);    
    
});


//this api will delete PO from from the contractor side but it will still be visible for the sake of history
router.post('/deletepo', function(req, res,next){
var Purchaseorders=require('../app/Purchaseorders');
Purchaseorders.indexDeletePO(req,res,next);    
    });



router.get('/pos', function(req, res,next){
var Purchaseorders=require('../app/Purchaseorders');
Purchaseorders.indexShowPO(req,res,next); 
});



//API to add an Order
router.post('/addorder', function(req, res, next){
   var Orders=require('../app/Orders');
   Orders.addOrder(req,res,next); 
    
});


//this api is for cancelling a order and it takes an orderId and cancellation reason
router.post('/cancelorder', function(req, res,next){
   var Orders=require('../app/Orders');
   Orders.cancelOrder(req,res,next);   

    });



//this post request is to add issues with some orders
router.post('/addissue', function(req, res,next){
var Issues=require('../app/Issues');
Issues.addIssue(req,res,next);
   
});


// router.post('/qrcode', function(req, res){
   
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
// var s="totalQuantity='"+totalQuantity+"'              orderedQuantity='"+orderedQuantity+"'         quality='"+quality+"'          customerName='"+customerName+"'         supplierId='"+supplierId+"'            date of dispatch='"+date+"''";
// var code= qr.imageSync('I love QR!' , {type:'png'} );
// //var code=qr.image(s,{type:'utf-8'});
// //var output =fs.createWriteStream('nodejitsu.svg')

// //res.type('png');
// //savePixels(code, "png").pipe(res);

// res.send(code);
// console.log(code);
// var st= JSON.stringify(code);
// console.log(st);
// //output=fs.createWriteStream('qr-image');
// //code.pipe(output);
// //code.pipe(res);
//     //console.log(code.pipe(res));
//     connection.connect(function(err){
//     //console.log("Connected form qrcode");
//     /*
//     var img1={
//         image: fs.readFileSync("C:/Users/Windows/Desktop/concreteApp/bag.jpg")
//     };*/

//    // var sql="insert into images SET ?";
//   var sql ="insert into images(image) value('"+st+"')";
//     connection.query(sql,function(err,result,fields){
//      if(err) throw err;


//     });

//   var sql ="select image from  images where imageId=23";
//     connection.query(sql,function(err,result,fields){
//      if(err) throw err;
     

// res.type('png');
// //savePixels(code, "png").pipe(res);
// console.log(JSON.parse(result[0].image));
// var a={"type":"Buffer","data":[137,80,78,71,13,10,26,10,0,0,0,13,73,72,68,82,0,0,0,145,0,0,0,145,8,0,0,0,0,230,179,5,255,0,0,1,21,73,68,65,84,120,218,237,218,65,18,194,32,12,5,208,222,255,210,122,129,130,9,133,80,156,199,74,219,41,60,23,25,195,167,215,231,109,227,34,34,34,34,34,34,34,34,34,34,250,79,209,245,123,52,159,120,50,11,17,81,129,168,93,12,221,133,7,103,33,34,42,21,221,45,119,119,183,249,53,48,11,17,209,9,162,252,44,68,68,39,136,84,63,209,9,162,128,55,117,119,117,199,70,68,52,99,79,27,248,84,188,203,38,34,154,145,67,54,119,183,219,146,81,34,162,161,254,168,31,55,230,159,37,34,42,21,165,122,161,104,71,31,237,158,136,136,150,137,2,171,247,35,245,246,114,143,171,159,136,104,92,244,184,229,137,70,54,68,68,165,162,254,38,54,122,109,176,234,136,136,150,137,82,37,213,76,216,83,21,70,68,84,32,74,37,136,129,179,208,212,191,18,17,209,90,209,236,230,167,248,84,148,136,40,145,67,70,19,156,212,239,34,34,122,175,168,255,162,214,164,254,136,136,168,82,148,47,66,34,162,237,162,193,148,60,16,252,16,17,109,18,69,223,209,154,120,32,74,68,180,86,180,117,16,17,17,17,17,17,17,17,17,17,157,47,250,2,64,181,157,174,90,85,141,189,0,0,0,0,73,69,78,68,174,66,96,130]};
// res.send(code);

//     });



// });
// });










//this function checks if the user is in session or not
function isAuthenticated(req, res, next){
    if(req.headers['authorization']){
        jwt.verify(req.headers['authorization'], secret, function(err, decoded){
            if(err){
                console.log(err);
                return handleError(err, null, res);
            }
            res.locals.userId = decoded.id;
            console.log("calling next now and " + res.locals.userId);
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
        msg = "there was some error at the server";
    }
    return res.json({
        success:false,
        msg: msg,
        err:err
    });
}
module.exports = router;

































//after this, the routes are not required in app 

//Passport serializing and deserializing user from a session
passport.serializeUser(function(user, done) {
    //console.log('user serialized');
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
   // User.findOneById(id, function(err, user) {
     
    connection.connect(function(err){
   // if(err) throw err;
    console.log("Connected form passport deserializeUser");
    connection.query("select * from user where user_id='"+id+"'",function(err,result,fields){

        done(err, result);
    });
});
});


//creating passport local strategy for login with email and password
passport.use(new LocalStrategy(

    function (username, password, done) {
        console.log('local st called')
       // User.findByUsername(username, function (err, user) {
          
            connection.connect(function(err){
		   //if(err) throw err;
		   var sql="select * from user where email='"+email+"'";
		   console.log(email);
		   connection.query(sql,function(err,result){
            if(err){
                return done(err);
            }
            if(result.length<=0){
                console.log("user with username : " + username + " not found");
                done(null, false, {usermsg:"user with this username does not exist"});
            }
            //User.comparePassword(password, user.password, function (err, isMatch) {
              
             bcrypt.compare(password, result[0].password, function(err, isMatch){
                if(err)throw err;
                 if(!isMatch){
                    return done(null, false, {passmsg:"Password is incorrect"});
                }
                return done(null, result);
            });

        })
    })
}
));


//for login page
// router.get('/login', function(req, res, next){
//     //here we generate captcha
//     var captcha = svgCaptcha.create();
//     //now we store the captcha text in req.session object
//     // for later verification on POST
//     req.session.captcha = captcha.text;

//     //we send along the captcha SVG(image) in the captcha variable
//     res.render('login',{
//         captcha:captcha.data
//     });
// });
