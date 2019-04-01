var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var expresshbs = require('express-handlebars');
var mongoose = require('mongoose');
var session = require('express-session');
var passport = require('passport');
var flash = require('connect-flash');
var validator = require('express-validator');
var MongoStore = require('connect-mongo')(session);

//Routes
var indexRouter = require('./routes/index');
var userRoutes = require('./routes/user');


var app = express();

mongoose.connect('mongodb://localhost:27017/shopping', { useNewUrlParser: true });
require('./config/passport');

// view engine setup
app.engine('.hbs', expresshbs({defaultLayout: 'layout', extname: '.hbs' }));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', '.hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(validator());//set up after the bodyparsers in previous lines
app.use(cookieParser());
app.use(session({
  secret: 'mysupersecret',
  resave:false,
  saveUninitialized: false,
  //storing session on MongoDB which will expire after 180 secs
  store: new MongoStore({mongooseConnection: mongoose.connection}),
  cookie: { maxAge: 180*60*1000 }//180 minutes
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req,res,next){
  //creating global variables
  res.locals.login = req.isAuthenticated();
  res.locals.session = req.session;
  next();
});

//path to pages with user routes
app.use('/user', userRoutes);
//path to home page
app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
