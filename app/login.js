var mysql= require('mysql');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var secret="supersecret";
var session = require('express-session');

//database connectivity
var dbconfig = require('../config/database');
var connection = mysql.createConnection(dbconfig.connection);




//Userlogin is for login of website user
var Userlogin=function(req,res,next){
//extracting all the info from request parameters
	var username = req.body.username;
	var password = req.body.password;
	//var captcha = req.body.captcha;

	//checking all the form-data is right
	req.checkBody('username', 'please enter a valid username').isEmail();
	req.checkBody('password', 'please enter a valid password').notEmpty();
	//req.checkBody('captcha', 'Captcha is incorrect').equals(req.session.captcha);

	console.log(req.body);
	//getting all the validation errors
	var errors = req.validationErrors();
	if(errors)
	{
	    console.log(errors);
		//res.redirect('/login');
         return  res.render('login',{success:false,msg:'There was some error' });
     }
     else{
		   console.log('else called');
		   console.log(username, password);						
		   //checking the user credentials for loggin him in with session
	        connection.connect(function(err){
		    console.log("Connected from login");
		    connection.query("select * from user where email='"+username+"'",function(err,result,fields){

			console.log(err);
			if(err){
				return  res.render('login',{success:false,msg:'There was some error' });
			}

			if(result.length<=0)
			{
				  console.log("user with username : " + username + " not found");
			     return res.render('login',{success:false,msg:'user with this username does not exist'});

			
			}
			
            if(result[0].usertype=='contractor')
            {
	            return res.render('login',{success:false,msg:'You are not a supplier!! Login from concreteApp or Signup as supplier'});
			}
           
             //check for account verification
              if(result[0].verified=='false'){
              	return res.render('login',{success:false,msg:'Your Account is pending for Admin verification'});
              }
              else{
           
              	console.log("new else block");

	     	 bcrypt.compare(password, result[0].password , function(err, isMatch){
				if(err)
				{
					console.log(errors);
					return res.render('login',{success:false,msg:'there was some error'});
			    }
				if(!isMatch)
				{
					return res.render('login',{success:false,msg:'Password is incorrect'});

				}
				// console.log("before jwl token");

				jwt.sign({id: result[0].userId}, secret, function(err, token)
				{
                  //  if(err)handleError(err, null, res);
                  if(err)
				{
					console.log(err);
					return res.render('login',{success:false,msg:'there was some error'});
			    }
                    req.session.token=token;
                    // console.log("token created and stored in session" + token);
                     if(username=='Info@equipshare.in' && password=='Info@equipshare')
                  {
                       return res.redirect('/admin/');
                  }
                       if(username=='info@equipshare.in' && password=='info@equipshare')
                  {
                       return res.redirect('/admin/');
                  }
              
                    return res.render('index');
               });
			});
	     	}
		});
      });
	}
}

//From here index function will work





module.exports={
	Userlogin:Userlogin,
    //indexLogin:indexLogin
};