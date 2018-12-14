var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var nodemailer = require('nodemailer');
//this is used for generating SVG Captchas
var svgCaptcha = require('svg-captcha');
var async = require('async');
var mysql= require('mysql');


var dbconfig = require('../config/database');
var connection = mysql.createConnection(dbconfig.connection);

   


router.get('/', (req,res,next) => {
		
 var Adminfunction=require('../app/Adminfunction');
 Adminfunction.getPendingProfilesForVerification(req,res,next);    
 
});


router.post('/verifyuser', function(req, res,next){
	 var Adminfunction=require('../app/Adminfunction');
 Adminfunction.verifyUser(req,res,next);    
 
})


module.exports = router;
