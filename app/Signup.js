    var mysql= require('mysql');
    var bcrypt = require('bcrypt');



    //database connectivity
var dbconfig = require('../config/database');
var connection = mysql.createConnection(dbconfig.connection);


   var Usersignup=function(req,res,next){

    var name = req.body.name;
	var email = req.body.email;
	var contact = req.body.contact;
	var city = req.body.city;
	var password = req.body.password;
	var password2 = req.body.password2;
	var userType = 'supplier';
    
    console.log(city);
	console.log(req.body.name);
	console.log(name);

	req.checkBody('name', 'Name cannot be empty').notEmpty();
	req.checkBody('email', 'Email cannot be empty').notEmpty();
	req.checkBody('contact', 'contact cannot be empty').notEmpty();
	req.checkBody('email', "Enter a valid email").isEmail();
	req.checkBody('password', 'password cannot be empty').notEmpty();
	req.checkBody('password2', 'confirm password cannot be empty').notEmpty();
	req.checkBody('password', 'Passwords do not match').equals(password2);

	var errors = req.validationErrors();
	console.log(errors);

	if(errors){
		//console.log(errors);
		// res.json({
		// 	success:false,
		// 	msg:"there was some error"
		// })
		res.render('login',{success:false,msg:'There was some error, please enter correct details during signup'});
	}else{
		console.log('else block called');
		var newUser = ({
			name:name,
			email:email,
			contact:contact,
			//pan:pan,
			//gstin:gstin,
			password:password,
			userType:userType
		})

		//User.createUser(newUser, function (err, user) {
		
		 bcrypt.hash(newUser.password, 10, function(err, hash){
        if(err) {
        	res.render('login',{success:false,msg:'There was some error!! signup again'});
        }
        newUser.password = hash;
        ///newUser.save(newUser, callback);
        

     connection.connect(function(err){
  // if(err) throw err;
   console.log(newUser.name);
   var sql="Insert into user ( name , email , contact ,  password , userType) values('"+newUser.name+"','"+newUser.email+"','"+newUser.contact+"','"+newUser.password+"','"+newUser.userType+"')";
   connection.query(sql,function(err,result){
      if(err) throw err;

			if(err){
				// res.send('some error occured');
				// throw err;
				res.render('login',{success:false,msg:'There was some error!! signup again'});
			}else{
				console.log(result);
				// res.json({
				// 	success: true,
				// 	msg: "user created"
				// })
				res.render('login',{success:true,msg:'Signup successful...!! '});
			}
		})
	})
})

}
}

//Applicationsignin
    var indexSignup=function(req,res,next){

    var name = req.body.name;
    var email = req.body.email;
    var custType = req.body.customertype || 'Buyer' ;
    var contact = req.body.contact;
    var pan = req.body.pan || null;
    var gstin = req.body.gstin || null;
    var password = req.body.password;
    var company = req.body.company;
    var password2 = req.body.password2;
    var userType = 'contractor';

    //console.log(req.body.name);
    //console.log(name);

    req.checkBody('name', 'Name cannot be empty').notEmpty();
    req.checkBody('email', 'Email cannot be empty').notEmpty();
    req.checkBody('contact', 'contact cannot be empty').notEmpty();
    //req.checkBody('pan', 'Pan cannot be empty').notEmpty();
    //req.checkBody('gstin', 'GSTIN cannot be empty').notEmpty();
    req.checkBody('email', "Enter a valid email").isEmail();
    req.checkBody('password', 'password cannot be empty').notEmpty();
    req.checkBody('password2', 'confirm password cannot be empty').notEmpty();
    req.checkBody('password', 'Passwords do not match').equals(password2);

    var errors = req.validationErrors();
 
    if(errors){
     
        return handleError(errors, null, res);
    }else{
        
        var newUser = ({
            name:name,
            email:email,
            custType:custType,
            contact:contact,
            pan:pan,
            company: company,
            gstin:gstin,
            password:password,
            userType:userType
        });

       bcrypt.hash(newUser.password, 10, function(err, hash){
        if(err)throw err;
        newUser.password = hash;
            if(err){
                return handleError(err, null, res);
            }else{
               
     connection.connect(function(err){

   console.log(newUser.name);
   var sql="Insert into user ( name , email , custType , contact , pan , company , gstin , password , userType) values('"+newUser.name+"','"+newUser.email+"','"+newUser.custType+"','"+newUser.contact+"','"+newUser.pan+"','"+newUser.company+"','"+newUser.gstin+"','"+newUser.password+"','"+newUser.userType+"')";
   connection.query(sql,function(err,result){
      if(err) throw err;
   });

});
                res.json({
                    success:true,
                    msg: 'user created'
                });
            }
        });
    }
    }


module.exports={
	Usersignup:Usersignup,
	indexSignup:indexSignup
};