
//For sending push notification
var notification-function(req,res,next){

var deviceId=req.body.deviceId;

jwt.verify(req.headers.authorization, secret, function(err, decoded){
        if(err){
            //console.log("%%%%%%%%%%%%%%%%%%%" + err);
            res.json({
                msg:"some error occured"
            })
            return;
        }
        var userId =  decoded.id;

var FCM = require('fcm-push');
var serverkey = 'AAAAPLs3NwY:APA91bEIj56f0rA_R1C8vBOJGrOeQ-hNaOvk3SQgnpvMmY7EV0P-eoo076KEaAn5htogLNczjbty3wkilgIyJcSk7j-eovqyfNATIsGwRYrFsQd2BmDrFY3niGb5QDhwg0MxaxSgG_do2kNEHtz8xh92Je9Ss1PCOQ';  
var fcm = new FCM(serverkey);
var message ={  
    to : 'f8_avypO3WE:APA91bEUyjbbUrElZ2lrFjb65p8jRADJAPaGOWPUpTlJxhkp4Q47FeDxb_8CuK6mGu65KRULJKbcJ5LyYO-UMBdodo7Bqqu7UeOtI2RqWFl38aIEWVEvyq7rW4R6kBcliWOXfG_IL6fztXI7UrBgJ8vZiQ9V1fgcUg',
    // collapse_key : '<insert-collapse-key>',
    // data : {
    //     <random-data-key1> : '<random-data-value1>',
    //     <random-data-key2> : '<random-data-value2>'
    // },
    notification : {
        title : 'Title of the notification',
        body : 'Body of the notification'
    }
};
fcm.send(message, function(err,response){  
      if(err) {
        console.log("Something has gone wrong !");
    } else {
        console.log("Successfully sent with resposne :",response);
    }
});
});
}

module.exports=notification;