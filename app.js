require('dotenv').config();
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var nodemailer = require('nodemailer');
var crypto = require('crypto');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var expressValidator = require('express-validator');



var index = require('./routes/index');
var users = require('./routes/users');
var admin = require('./routes/admin');
var driver = require('./routes/driver');
//var css=require('./views/css');


//var views=require('views/');
var app = express();
//app.use(express.static(path.join(__dirname,'/views')));
app.use(express.static(path.join(__dirname,'/img')));
app.use(express.static(path.join(__dirname,'/css')));
app.use(express.static(path.join(__dirname,'/js')));
//app.use(express.static(path.join(__dirname,'views','/')));
app.use(express.static(path.join(__dirname,'/public')));
// app.use((express.static(path.join(__dirname,'/views'))));
// app.use(express.static(__dirname + '/views'))

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/views')));
app.use(expressValidator());
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}));


app.use(passport.initialize());
app.use(passport.session());

//app.use('/api/users/views',views);
app.use('/', index);
app.use('/users', users);
app.use('/admin', admin);
app.use('/driver', driver);
//app.use('/api/users/css',css);



app.get('/login', function(req, res){
   console.log("here1");
  res.render('login.ejs',{success:null});
})

app.get('/', function(req, res){

  res.render('login.ejs', {success:null});

});


app.get('/logout', function(req, res){
   console.log("logout successfull");
   req.session.destroy(function(err){
   console.log("session destroyed");
    if(err)
    {
      console.log("error in destroying session");
      req.negotiate(err);
    }
   })
  res.render('login.ejs',{success:null});
})

app.get('/index', function(req, res){
  res.render('index.ejs');
})
app.get('/users/index', function(req, res){
  res.render('index.ejs');
})

app.get('/users/', function(req, res){
   res.render('login', {success:null});
})


app.use('*', function(req, res){

  console.log('* called');
   res.render('login.ejs',{success:null});

});



// app.get('/cancel-order-tables', function(req, res){
//   res.render('cancel-order-tables.ejs');
// })

// app.get('/update-password', function(req, res){
//   res.render('update-password.ejs', {success:null});
// })

// app.get('/form', function(req, res){
//   res.render('form');
// })



// app.use('/index.html', function(req, res){
//   res.sendFile(path.join(__dirname, 'views/index.html'));
// })

app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.')
            , root    = namespace.shift()
            , formParam = root;

        while(namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param : formParam,
            msg   : msg,
            value : value
        };
    }
}));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  console.log(err);
  res.send(err);
});

module.exports = app;
