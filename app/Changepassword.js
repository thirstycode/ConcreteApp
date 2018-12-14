    var mysql= require('mysql');
    var bcrypt = require('bcrypt');
    var jwt = require('jsonwebtoken');
   // var secret="supersecret";
    // const secret = "supersecretkey";


    //database connectivity
var dbconfig = require('../config/database');
var connection = mysql.createConnection(dbconfig.connection);

   var Userchangepassword=function(req,res,next){
    var secret="supersecret";
    var oldpass = req.body.oldpass;
	var newpass = req.body.newpass;
	var newpass2 = req.body.newpass2;

console.log(req.session.token);
	jwt.verify(req.session.token, secret, function(err, decoded){
	if(err){
			console.log("%%%%%%%%%%%%%%%%%%%" + err);
			return res.render('login',{success:false,msg:'session expired Login again'});
		}
		var userId = decoded.id;

		//User.findById(userId, function(err, user){
		
		connection.connect(function(err){
    console.log("Connected from changepass");
    connection.query("select * from user where userId='"+userId+"'",function(err,result,fields){



			if(err){
				handleError(err, '', res);
				return;
			}
			bcrypt.compare(oldpass, result[0].password, function(err, match) {
				if(!match){
				
				    return res.render('update-password',{success:false,msg:'old password is not correct'});
				}
				if(newpass != newpass2){
				
					return res.render('update-password',{success:false,msg:'passwords do not match'});
				}
				bcrypt.hash(newpass, 10, function(err, hash){
					if(err){
						handleError(err, '', res);
						return;
					}
					result[0].password = hash;
					//user.save();
					  connection.query("update user SET password='"+result[0].password+"' where userId='"+userId+"'",function(err,result,fields){
                       if(err) throw err;
			          res.render('update-password',{success:true,msg:'Password Updated successfully'});
				});
			});
		})
	});
});
});
}

//App side change password
   var indexChangePassword=function(req,res,next){
   
    const secret = "supersecretkey";

    var oldpass = req.body.oldpass;
	var newpass = req.body.newpass;
	var newpass2 = req.body.newpass2;
	console.log(req.body);

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
		var userId = decoded.id;



       connection.connect(function(err){

    console.log("Connected from changepass");
    connection.query("select * from user where userId='"+userId+"'",function(err,result,fields){
   if(err) throw err;



			bcrypt.compare(oldpass, result[0].password, function(err, match) {
				if(!match){
					res.json({
						success:false,
						msg:'old password is not correct'
					});
					return;
				}
				if(newpass != newpass2){
					res.json({
						success:false,
						msg:'passwords do not match'
					});
					return;
				}
				bcrypt.hash(newpass, 10, function(err, hash){
					if(err){
						handleError(err, '', res);
						return;
					}
					result[0].password = hash;
				
                     connection.query("update user SET password='"+result[0].password+"' where userId='"+userId+"'",function(err,result,fields){
                       if(err) throw err;

					res.json({
						success:true,
						msg:'password updates successfully'
					});
				});
			});
		})
	});
});
});
}

module.exports={
	Userchangepassword:Userchangepassword,
    indexChangePassword:indexChangePassword
};