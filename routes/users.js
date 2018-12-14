var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var nodemailer = require('nodemailer');
//this is used for generating SVG Captchas
var svgCaptcha = require('svg-captcha');
var jwt = require('jsonwebtoken');
var secret="supersecret";
var async = require('async');
var bcrypt = require('bcrypt');
var mysql= require('mysql');
var session = require('express-session');
//importing passport and its local strategy
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var sendgridUser = process.env.SENDGRID_USERNAME;
var sendgridPass = process.env.SENDGRID_PASS;

// var db=require('../routes/database');

var dbconfig = require('../config/database');
var connection = mysql.createConnection(dbconfig.connection);

//var LocalStrategy = require('passport-local').Strategy;


//These are all the get requests

/* GET home page. */
router.get('/tables', function(req, res, next){
   var Quotations=require('../app/Quotations');
    Quotations.QuotesForSupplier(req,res,next);
});



//for login page
// router.get('/login', function(req, res, next){
// 	//here we generate captcha
// 	var captcha = svgCaptcha.create();
// 	//now we store the captcha text in req.session object
// 	// for later verification on POST
// 	req.session.captcha = captcha.text;

// 	//we send along the captcha SVG(image) in the captcha variable
// 	res.render('login2',{
// 		captcha:captcha.data
// 	})
// });









//These are all the POST requests

//POST for login
//this takes username, password and captcha
router.post('/login', function(req, res, next){

var login=require('../app/login.js');
login.Userlogin(req,res,next);

});





//this route is for creating new user
router.post('/signup', function(req, res, next){

var Signup=require('../app/Signup');
Signup.Usersignup(req,res,next);

});



//this route returns the profile info of the current logged in user
router.get('/profile', function(req,res,next){

    var Profile=require('../app/Profile');
    Profile.Usergetprofile(req,res,next);
});


//this route is called as POST when profile change is required
router.post('/profile', function(req, res,next){

	var Profile=require('../app/Profile');
    Profile.Userpostprofile(req,res,next);

	
});


//this api will change password of website user
router.post('/changepass', function(req, res,next){
	var Changepassword=require('../app/Changepassword');
	Changepassword.Userchangepassword(req,res,next);
	});


//this route returns all the order(cancelled as well as successful)
router.get('/history', function(req, res,next){
  var Orders=require('../app/Orders');
  Orders.Userhistory(req,res,next);

});




//this will record the suppliers response to quotes
router.post('/respondtoquote', function(req,res,next){
	var Responses=require('../app/Responses');
	Responses(req,res,next);
});


//this api will remove a quote response that a supplier submitted earlier
router.post('/removequote', function(req,res,next){

var Quotations=require('../app/Quotations');
Quotations.RemoveQuoteBySupplier(req,res,next);

});

//this api will show PO requests in response to the quotes the supplier sent out , waiting to be confirmed
router.get('/pendingpo', function(req, res,next){
   var Purchaseorders=require('../app/Purchaseorders');
   Purchaseorders.pendingPOForSupplier(req,res,next);

});


//this api will confirm the PO accepted by supplier
router.post('/confirmpendingpo', function(req, res,next){
var Purchaseorders=require('../app/Purchaseorders');
Purchaseorders.confirmPendingPOBySupplier(req,res,next);
});

//this api will show all the orders that are pending confirmation from seller
router.get('/pendingorders', function(req, res,next){
  var Orders=require('../app/Orders');
  Orders.pendingOrdersForSupplier(req,res,next);
});



//this api will show all the orders for today's date
router.get('/todayorders', function(req, res,next){
  var Orders=require('../app/Orders');
  Orders.todayOrders(req,res,next);
});



//Admin database will be send from this api
router.get('/admindb', function(req,res,next){
 var Adminfunction=require('../app/Adminfunction');
 Adminfunction.adminDatabase(req,res,next);    
});

//this api will confirm the order from seller and add description from the seller about the order
router.post('/pendingorders', function(req, res,next){
  var Orders=require('../app/Orders');
  Orders.approveOrders(req,res,next);
	
});

//This api will search for a driver with contact number 
router.post('/searchDriver',function(req,res,next){
var Driver=require('../app/driver');
Driver.SearchDriver(req,res,next);

});

//This api will give details of all the drivers working for particular company
router.get('/driverdetails', function(req, res,next){
var Driver=require('../app/driver');
Driver.GetDriverDetails(req,res,next);
 });


//This api will add driver details of particular company to database in driverdetails table
router.post('/driverdetails', function(req, res,next){

var Driver=require('../app/driver');
Driver.PostDriverDetails(req,res,next);
	
});


//This api will store details of dispatch order with particular driver
router.post('/dispatchorder',function(req,res,next){

  var Orders=require('../app/Orders');
  Orders.dispatchOrder(req,res,next);

})

//This api will Unregister Driver From Particular Company
// router.post('/unregisterDriver',function(req,res,next){
// var Driver=require('../app/driver');
// Driver.UnregisterDriver(req,res,next);
// });



//this is post for forgot password which requires user's email id
router.post('/forgot', function(req, res){
	var email = req.body.email;
	
	//User.findOneByEmail(email, function(err, user){
		
    connection.connect(function(err){
   //if(err) throw err;
   var sql="select * from user where email='"+email+"'";
   console.log(email);
   connection.query(sql,function(err,result){

		if(err){
			handleError(err, '', res);
			return;
		};
		if(result.length<0){
			res.json({
				success: true,
				results:"no user with this username exists"
			});
		}
		crypto.randomBytes(20, function(err, buf){
			if(err)throw err;
			var token = buf.toString('hex');
			result[0].resetPasswordToken = token;
            result[0].resetPasswordExpire = Date.now() + 3600000; //1hour
			

			
		   var sql="update user set resetPasswordExpire='"+result[0].resetPasswordExpire+"', resetPasswordToken='"+result[0].resetPasswordToken+"' where email='"+email+"'";
		   //console.log(email);
		   connection.query(sql,function(err,result){

		//	user.save(function(err){
			

				if(err)throw err;
			});

			var smtpTransport = nodemailer.createTransport({
				service:'SendGrid',
				auth:{
					user:sendgridUser,
					pass:sendgridPass
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
				res.send("a mail has been sent to your registered mail id");
			})
		})
	})
});
});


//this route will verify the password token hasn't expire and returns a json response
router.get('/reset/:token', function(req, res) {
	//User.findOneForResetPassword(req.params.token, function(err, user) {
	
     connection.connect(function(err){
    console.log("Connected form resetpasswordget");
    connection.query("select * from user where resetPasswordToken='"+req.params.token+"' &  resetPasswordExpire <'"+Date.now()+"'",function(err,result,fields){
   if(err) throw err;

	  if (result.length<0) {
		  var result = {
			  err:true,
			  msg:'Password reset token is invalid or has expired.'
		  }
		return res.status(200).json(result);
	  }
	  var result = {
		  msg:"reset your password", 
		  user:user
	  }
	  res.status(200).json(result);
	})
})
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





router.get('/cancelledorders', function(req, res){
	jwt.verify(req.headers.authorization, secret, function(err, decoded){
	if(err){
			console.log("%%%%%%%%%%%%%%%%%%%" + err);
			return res.render('login',{success:false,msg:'session expired Login again'});
		}
		var userId =  decoded.id;
		let d = new Date();
		var y = new Date(d.getTime()-(d.getHours() * 60*60*1000 + d.getMinutes()*60*1000 + d.getSeconds()*1000))
		//Order.getCancelledOrdersForResponseBySupplierId(userId, y.getTime(), function(err, orders){
			
     connection.connect(function(err){
   //if(err) throw err;
   var sql="select * from orders where status='cancelled' && supplierId='"+userId+"' && generationDate > '"+y.getTime()+"' ";
   connection.query(sql,function(err,result){

            
			if(err){
				res.json({
					success:false,
					msg:"some error occured"
				})
				return;
			};
			res.json({
				success:true,
				results:result
			});
		});
	});
})
});





router.post('/completeorder', function(req, res){
	var status = 'completed';
	var statusDate = Date.now();
	var statusDesc = req.body.desc || 'The full order is delivered by supplier';
	var orderId = req.body.orderId;

	//Order.updatePendingOrder(orderId, status, statusDesc, statusDate, function(err, order){
		
    connection.connect(function(err){
   //if(err) throw err;
   var sql="update orders set status='"+status+"' , statusDesc='"+statusDesc+"' , statusDate= '"+statusDate+"' where orderId='"+orderId+"' ";
   connection.query(sql,function(err,result){


		if(err){
			res.json({
				success:false,
				msg:"some error occured"
			})
			return;
		};
		res.json({
			success:true,
			results:result
		});
	})
});
});











//this function checks if the user is in session or not



























// //these routes are not used
// //not used
// //this route is used to add a customer site
// router.post('/addsite', function(req, res){
// 	var name = req.body.name;
// 	var lat = req.body.lat;
// 	var long = req.body.long;
// 	var address = req.body.address;

// 	req.checkBody('name', 'Name cannot be empty').notEmpty();
// 	req.checkBody('lat', 'lat cannot be empty').notEmpty();
// 	req.checkBody('long', 'long cannot be empty').notEmpty();
// 	req.checkBody('address', 'address cannot be empty').notEmpty();

// 	var errors = req.validationErrors();
// 	console.log(errors);

// 	if(errors){
// 		//console.log(errors);
// 		res.send(errors);
// 	}else{
// 		console.log('else block called');
// 		var customerSite = {
// 			name:name,
// 			lat:lat,
// 			long:long,
// 			address:address
// 		};
// 		console.log(customerSite);

// 		User.addSite(customerSite, req.user._id, function (err, user) {
// 			if(err){
// 				res.send('some error occured');
// 				throw err;
// 			}else{
// 				console.log(user);
// 				res.send('site added');
// 			}
// 		})
// 	}
// })


// //not used
// //this route deletes site from the site array in user document
// router.post('/deletesite', function(req, res){
// 	//change this to pick userid from req header and site id  from req.body
// 	User.removeSite(req.body.userid, req.body.siteid, function(err, site){
// 		if(err)throw err;
// 		res.send(site);
// 	})
// })

// //not using this
// //this route will cancel an existing quote that was created by contractor
// router.post('/cancelquote', function(req, res){
// 	var quoteId = req.body.quoteId;
// 	console.log(quoteId);
// 	console.log(req.body);
// 	Quote.cancelQuote(quoteId, function(err, quote){
// 		if(err)throw err;
// 		res.send('quote is cancelled' + quote);
// 	})
// })


// //not using this
// router.post('/requestquote', function(req, res){
// 	console.log(req);
// 	var quality = req.body.quality;
// 	var quantity = req.body.quantity;
// 	var customerSite = req.body.customerSite;
// 	var generationDate =  Date.now();
// 	var requiredDate = req.body.requiredDate;
// 	var requestedBy = req.user.name;
// 	var requestedById = req.user._id;

// 	req.checkBody('quantity', 'quantity cannot be empty').notEmpty();
// 	req.checkBody('quality', 'quality cannot be empty').notEmpty();
// 	req.checkBody('customerSite', 'customerSite cannot be empty').notEmpty();
// 	req.checkBody('requiredDate', 'requiredDate cannot be empty').notEmpty();

// 	var errors = req.validationErrors();
// 	console.log(errors);
	
// 	if(errors){
// 		res.send(errors);
// 	}else{
// 		var newQuote = new Quote({
// 			quantity : quantity,
// 			quality : quality,
// 			customerSite : customerSite,
// 			generationDate : generationDate,
// 			requiredDate : requiredDate,
// 			requestedBy : requestedBy,
// 			requestedById : requestedById
// 		})

// 		Quote.addQuote(newQuote, function(err, quote){
// 			res.send('new request for quote submitted for ' + quote.quantity + ' of ' + quote.quality  + ' quality redimix.');
// 		})
// 	}
// })


// //not using this
// //API to add an Order
// router.post('/addorder', function(req, res, next){
// 	var quantity = req.body.quantity;
// 	var quality = req.body.quality;
// 	var requestedBy = req.body.requestedBy;
// 	var date = new Date();
// 	var requestedById = req.body.requestedById;
// 	var status = 'ongoing';

// 	console.log(req.body.quantity);
// 	console.log(quantity);

// 	req.checkBody('quantity', 'quantity cannot be empty').notEmpty();
// 	req.checkBody('quality', 'quality cannot be empty').notEmpty();
// 	req.checkBody('requestedBy', 'requestedBy cannot be empty').notEmpty();

// 	var errors = req.validationErrors();
// 	console.log(errors);

// 	if(errors){
// 		//console.log(errors);
// 		res.send(errors);
// 	}else{
// 		console.log('else block called');
// 		var newOrder = new Order({
// 			quality:quality,
// 			quantity:quantity,
// 			requestedBy:requestedBy,
// 			requestedById:requestedById,
// 			date:date,
// 			status:status
// 		})

// 		Order.createOrder(newOrder, function (err, Order) {
// 			if(err){
// 				res.send('some error occured');
// 				throw err;
// 			}else{
// 				console.log(Order);
// 				res.send('Order created');
// 			}
// 		})
// 	}
// })


// //not using this
// //this api is for cancelling a order and it takes an orderId and cancellation reason
// router.post('/cancelorder', function(req, res){
// 	var orderId = req.body.orderId;
// 	var reason = req.body.reason;
// 	console.log(orderId);
// 	console.log(reason);
// 	console.log(req.body);
// 	Order.cancelOrder(orderId, reason, function(err, order){
// 		if(err)throw err;router.post('/pendingorders', function(req, res){
// 	var status = 'approved';
// 	var statusDate = Date.now();
// 	var statusDesc = req.body.statusDesc || 'The supplier has confirmed to deliver your order';
// 	var orderId = req.body.orderId;

// 	Order.updatePendingOrder(orderId, status, statusDesc, statusDate, function(err, order){
// 		if(err){
// 			res.json({
// 				success:false,
// 				msg:"some error occured"
// 			})
// 			return;
// 		};
// 		res.json({
// 			success:true,
// 			results:order
// 		})
// 	})
// })

// 		res.send('order is cancelled' + order);
// 	})
// })


// //not using this
// //this post request is to add issues with some orders
// router.post('/addissue', function(req, res){
// 	console.log(req.user);
// 	var title = req.body.title;
// 	var description = req.body.description;
// 	var orderId = req.body.orderId;
// 	var userId = req.user._id;
// 	var type = req.body.type;
// 	var date = Date.now();
// 	var status = 'submitted to manager';

// 	req.checkBody('title', 'title cannot be empty').notEmpty();
// 	req.checkBody('description', 'description cannot be empty').notEmpty();
// 	req.checkBody('orderId', 'orderId cannot be empty').notEmpty();
// 	req.checkBody('type', 'type cannot be empty').notEmpty();

// 	var errors = req.validationErrors();
// 	console.log(errors);
	
// 	if(errors){
// 		res.send(errors);
// 	}else{
// 		var newIssue = new Issue({
// 			title:title,
// 			type:type,
// 			description:description,
// 			orderId:orderId,
// 			userId:userId,
// 			date:date,
// 			status:status
// 		})

// 		Issue.addIssue(newIssue, function(err, issue){
// 			if(err)throw err;
// 			res.redirect('/');
// 		})
// 	}
// })

function isAuthenticated(req, res, next){
    //if(req.headers['authorization']){
      if(req.session.token){
        console.log(req.session.token);
		jwt.verify(req.session.token, secret, function(err, decoded){
            // if(err){
            //     console.log(err);
            //     return handleError(err, null, res);
            // }
            if(err){
			console.log("%%%%%%%%%%%%%%%%%%%" + err);
			return res.render('login',{success:false,msg:'session expired Login again'});
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
        })
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














	

//Passport serializing and deserializing user from a session
// passport.serializeUser(function(user, done) {
// 	//console.log('user serialized');
// 	done(null, user.id);
// })

// passport.deserializeUser(function(id, done) {
// 	User.findOneById(id, function(err, user) {
// 		done(err, user);
// 	})
// })



// //creating passport local strategy for login with email and password
// passport.use(new LocalStrategy(
// 	function (username, password, done) {
// 		console.log('local st called')
// 		User.findByUsername(username, function (err, user) {
// 			if(err){
// 				return done(err);
// 			}
// 			if(!user){
// 				console.log("user with username : " + username + " not found");
// 				done(null, false, {usermsg:"user with this username does not exist"})
// 			}
// 			User.comparePassword(password, user.password, function (err, isMatch) {
// 				if(err)throw err;
// 				if(!isMatch){
// 					return done(null, false, {passmsg:"Password is incorrect"})
// 				}
// 				return done(null, user);
// 			})

// 		})
// 	}
// ));



module.exports = router;
