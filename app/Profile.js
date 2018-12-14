   var mysql= require('mysql');
   var jwt = require('jsonwebtoken');
  

    //database connectivity
var dbconfig = require('../config/database');
var connection = mysql.createConnection(dbconfig.connection);


var Usergetprofile=function(req,res,next){
//checking session use for token
 var secret="supersecret";
console.log(req.session.token);
	jwt.verify(req.session.token, secret, function(err, decoded){
//	jwt.verify(req.headers.authorization, secret, function(err, decoded){
	if(err){
			console.log("%%%%%%%%%%%%%%%%%%%" + err);
			return res.render('login',{success:false,msg:'session expired Login again'});
		}
		var userId =  decoded.id;
		console.log(userId);
		console.log(decoded);

		//User.findOneById(userId, function(err, user){
			
      connection.connect(function(err){
   
    console.log("Connected form profile");
    connection.query("select * from user where userId='"+userId+"'",function(err,results,fields){
   if(err) throw err;


	res.render('user-profile',{user:results});	     
             

		})
	})
})
}

var Userpostprofile=function(req,res,next){
       var secret="supersecret";
       console.log(req.session.token);
	   jwt.verify(req.session.token, secret, function(err, decoded){

		if(err){
			console.log("%%%%%%%%%%%%%%%%%%%" + err);
			return res.render('login',{success:false,msg:'session expired Login again'});
		}
		var userId =  decoded.id;
		var id = userId;
		var name = req.body.name;
		var email = req.body.email;
		var contact = req.body.contact;
		var pan = req.body.pan;
		var gstin = req.body.gstin;

		console.log(req.body.name);
		console.log(name);

		req.checkBody('name', 'Name cannot be empty').notEmpty();
		req.checkBody('email', 'Email cannot be empty').notEmpty();
		req.checkBody('contact', 'contact cannot be empty').notEmpty();
		req.checkBody('pan', 'Pan cannot be empty').notEmpty();
		req.checkBody('gstin', 'GSTIN cannot be empty').notEmpty();
		req.checkBody('email', "Enter a valid email").isEmail();
		
		var errors = req.validationErrors();
		console.log(errors);

		if(errors){
		
		res.render('user-profile');
		}else{
             connection.connect(function(err){
	
		   console.log("Connected from post profile");
		  
			    var sql="update user SET name='"+name+"', email='"+email+"',contact='"+contact+"',pan='"+pan+"',gstin='"+gstin+"' where userId='"+id+"'";
			    connection.query(sql,function(err,result,fields){
			  
					if(err){
						handleError(err, 'error updating user details', res);
						return;
					}
					connection.query("select * from user where userId='"+userId+"'",function(err,results,fields){
                    if(err) throw err;
				
					res.render('user-profile',{user:results});
				})
			})
		})
		}
	})
}


var indexGetProfile=function(req,res,next){
	const secret = "supersecretkey";
    console.log("from index");
    jwt.verify(req.headers.authorization, secret, function(err, decoded){
        if(err){
            //console.log("%%%%%%%%%%%%%%%%%%%" + err);
            res.json({
                msg:"some error occured"
            })
            return;
        }
        var userId =  decoded.id;
    
        //User.findOneById( userId, function(err, user){
            console.log(userId);
     connection.connect(function(err){
   // if(err) throw err;
    console.log("Connected form profile");
    connection.query("select * from user where userId='"+userId+"'",function(err,results,fields){
   if(err) throw err;
      

			    connection.query("select * from customersite where userId='"+userId+"'",function(err,result,fields){
			   if(err) throw err;

            if(err){
                return handleError(err, null, res);
            }
            res.json({
                success:true,
                user:results[0],
                customerSite:result
            });
        });
    });
});
});
}


var indexPostProfile=function(req,res,next){
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

    
        var id = userId;
        var name = req.body.name;
        var email = req.body.email;
        var contact = req.body.contact;
        var pan = req.body.pan;
        var gstin = req.body.gstin;

      
//no need to check for id
       // req.checkBody('id', 'id cannot be empty').notEmpty();
        req.checkBody('name', 'Name cannot be empty').notEmpty();
        req.checkBody('email', 'Email cannot be empty').notEmpty();
        req.checkBody('contact', 'contact cannot be empty').notEmpty();
        req.checkBody('email', "Enter a valid email").isEmail();
        
        var errors = req.validationErrors();
        //console.log(errors);

        if(errors){
            return handleError(errors, null, res);
        }
        else{
            connection.connect(function(err){
		 
		    console.log("Connected form edit profile");
		  
			    var sql="update user SET name='"+name+"', email='"+email+"',contact='"+contact+"',pan='"+pan+"',gstin='"+gstin+"' where userId='"+id+"'";
			    connection.query(sql,function(err,result,fields){
			   if(err) throw err;

                    if(err){
                        handleError(err, null, res);
                    }
                    res.json({
                        success:true,
                        user:result
                    })
                });
            });
         }
     });

}




module.exports= {
	Usergetprofile:Usergetprofile,
	Userpostprofile:Userpostprofile,
	indexGetProfile:indexGetProfile,
	indexPostProfile:indexPostProfile
};