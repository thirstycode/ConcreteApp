   var mysql= require('mysql');
 var jwt = require('jsonwebtoken');
 const secret = "supersecretkey";

  //database connectivity
var dbconfig = require('../config/database');
var connection = mysql.createConnection(dbconfig.connection);


var addSite=function(req,res,next){
 jwt.verify(req.headers.authorization, secret, function(err, decoded){
        if(err){
            //console.log("%%%%%%%%%%%%%%%%%%%" + err);
            res.json({
                msg:"some error occured"
            })
            return;
        }
        var userId =  decoded.id;
    
        var name = req.body.name;
        var lat = req.body.lat;
        var long = req.body.long;
        var address = req.body.address;
        var city = req.body.city;

        req.checkBody('name', 'Name cannot be empty').notEmpty();
        req.checkBody('lat', 'lat cannot be empty').notEmpty();
        req.checkBody('long', 'long cannot be empty').notEmpty();
        req.checkBody('address', 'address cannot be empty').notEmpty();
        req.checkBody('city', 'city cannot be empty').notEmpty();

        var errors = req.validationErrors();
      
        if(errors){
            
            res.send(errors);
        }else{
            
            var newCustomerSite = ({
                name:name,
                lat:lat,
                city:city,
                long:long,
                address:address
            });
          
              
                   connection.connect(function(err){
				    console.log("Connected form addSite");
				    var sql="Insert into customersite ( address , lon , lat , name , userId,city) values('"+newCustomerSite.address+"','"+newCustomerSite.long+"','"+newCustomerSite.lat+"','"+newCustomerSite.name+"','"+userId+"','"+newCustomerSite.city+"')";
				    connection.query(sql,function(err,result,fields){
				   if(err) throw err;
                
                if(err){
                    return handleError(err, null, res);
                }else{
                    //console.log(user);
                    res.json({
                        success:true,
                        msg: 'user created'
                    });
                }
            })
				})
        }
    });
}


var deleteSite=function(req,res,next){
  jwt.verify(req.headers.authorization, secret, function(err, decoded){
        if(err){
            //console.log("%%%%%%%%%%%%%%%%%%%" + err);
            res.json({
                msg:"some error occured"
            })
            return;
        }
        var userId =  decoded.id;
        var customerSiteId = req.body.siteid;
       // User.removeSite( userId, req.body.siteid, function(err, site){
       
        connection.connect(function(err){
       console.log("Connected form deletesite");
      // var sql="update customerSite SET address=null,lon=null,lat=null,name=null,userId=null where userId='"+userId+"'";
    var sql="delete from customersite where customerSiteId='"+customerSiteId+"'";
    connection.query(sql,function(err,result,fields){
  

            if(err){
                return handleError(err, null, res);
            }
            res.json({
                success:true,
                msg:"site deleted",
                site:result[0]
            })
        });
    });
});

}
module.exports={
addSite:addSite,
deleteSite:deleteSite
};