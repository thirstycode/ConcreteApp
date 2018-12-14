
var jwt = require('jsonwebtoken');
var mysql= require('mysql');
const secret = "supersecretkey";

//database connectivity
var dbconfig = require('../config/database');
var connection = mysql.createConnection(dbconfig.connection); 




var addIssue=function(req,res,next){
 jwt.verify(req.headers.authorization, secret, function(err, decoded){
        if(err){
            //console.log("%%%%%%%%%%%%%%%%%%%" + err);
            res.json({
                msg:"some error occured"
            })
            return;
        }
        var userId =  decoded.id;

        //console.log(req.user);
        var title = req.body.title;
        var description = req.body.description;
        var orderId = req.body.orderId;
        var userId = userId;
        var type = req.body.type;
        var date = Date.now();
        var status = 'submitted to manager';

        req.checkBody('title', 'title cannot be empty').notEmpty();
        req.checkBody('description', 'description cannot be empty').notEmpty();
        req.checkBody('orderId', 'orderId cannot be empty').notEmpty();
        req.checkBody('type', 'type cannot be empty').notEmpty();

        var errors = req.validationErrors();
        console.log(errors);
        
        if(errors){
            res.send(errors, null, res);
        }else{
            var newIssue = ({
                title:title,
                type:type,
                description:description,
                orderId:orderId,
                userId:userId,
                date:date,
                status:status
            });

            //Issue.addIssue(newIssue, function(err, issue){
                console.log(newIssue.orderId);
                console.log(newIssue.userId);

                   connection.connect(function(err){
				   console.log("Connected from addIssue");
				   var sql="Insert into issues ( title , type , description , orderId , userId, date , status) values('"+newIssue.title+"','"+newIssue.type+"','"+newIssue.description+"','"+orderId+"','"+userId+"','"+newIssue.date+"','"+newIssue.status+"')";
				    connection.query(sql,function(err,result,fields){
				  if(err){
                    return handleError(err, null, res);
                }
                res.json({
                    success:true,
                    issue:result,
                    msg:"issue raised successfully"
                })
            })
        
          });
  }
})
}

module.exports={
    addIssue:addIssue
};