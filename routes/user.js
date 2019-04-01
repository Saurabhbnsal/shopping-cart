var express = require('express');
var router = express.Router();
var passport = require('passport');
var csrf = require('csurf');

var csrfProtection = csrf();
router.use(csrfProtection);

var Order = require('../models/order');
var Cart = require('../models/cart');

//Loading the profile page
router.get('/profile', isLoggedIn,function(req,res, next){//profile page will only open if logged in
  Order.find({user: req.user}, function(err, orders){
    if(err){
      return res.write('Error');
    }
    var cart;
    orders.forEach(function(order){
        cart = new Cart(order.cart);
        order.items = cart.generateArray();
    });
    res.render('user/profile', {orders: orders});
  });

});

router.get('/logout',isLoggedIn, function(req,res,next){
  req.logout();
  res.redirect('/');
});


//For all the pages which should not load if logged in(all pages except profile)
router.use('/', notLoggedIn, function(req,res,next){
  next();
});
//Get request for the signup page
router.get('/signup', function(req,res,next){
  var messages = req.flash('error');//Error flash messages(if any)
  res.render('user/signup', {csrfToken: req.csrfToken(), messages:messages, hasErrors: messages.length >0 });
});
//Storing a new User in the database
router.post('/signup',passport.authenticate('local.signup', {

  failureRedirect: '/user/signup',
  failureFlash: true
}), function(req,res,next){
  if(req.session.oldUrl){
    var oldUrl = req.session.oldUrl;
    req.session.oldUrl = null;
    res.redirect(oldUrl);
  }else{
    res.redirect('/user/profile');
  }
  });

//routes to the sign in page
router.get('/signin', function(req,res,next){
  var messages = req.flash('error');//Error flash messages(if any)
  res.render('user/signin', {csrfToken: req.csrfToken(), messages:messages, hasErrors: messages.length >0 });
});

router.post('/signin', passport.authenticate('local.signin', {
  failureRedirect: '/user/signin',
  failureFlash: true
}), function(req,res,next){
  if(req.session.oldUrl){
    var oldUrl = req.session.oldUrl;
    req.session.oldUrl = null;
    res.redirect(oldUrl);
  }else{
    res.redirect('/user/profile');
  }
});



module.exports = router;

//function to check if loggedin
function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/');
}

//function to check if loggedin
function notLoggedIn(req,res,next){
  if(!req.isAuthenticated()){
    return next();
  }
  res.redirect('/');
}
