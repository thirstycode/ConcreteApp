 var mysql= require('mysql');

   //database connectivity
var dbconfig = require('../config/database');
var connection = mysql.createConnection(dbconfig.connection);


var addCity=function(req,res,next){
 var city = req.body.city;
      connection.connect(function(err){
         if(err) throw err;
    console.log("Connected form addcity");
    connection.query("Insert into cities Values('"+city+"')",function(err,result,fields){
   if(err) throw err;
            res.json({
                success:true,
                city: result
            });
        });
    });
}

   var getCities=function(req,res,next){
      connection.connect(function(err){

      console.log("Connected form getAllCities");
      connection.query("select * from cities",function(err,result,fields){
         if(err) throw err;
           console.log("Query updated");
        
         res.json
         ({
            success:true,
            cities:result
       })
    });
   });
}

module.exports={
  addCity:addCity,
  getCities:getCities
}
