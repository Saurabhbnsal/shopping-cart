var passport = require('passport');
var User = require('../models/user');
var LocalStrategy = require('passport-local').Strategy;//LocalStrategy means signup details stored on local server

passport.serializeUser(function(user,done){
  done(null, user.id);//serialize the login details by ID
});

passport.deserializeUser(function(id,done){
  User.findById(id,function(err,user){
    done(err,user);
  });
});

//signup process using the local strategy
passport.use('local.signup', new LocalStrategy({
  usernameField: 'email',
  password: 'password',
  passReqToCallback: true
}, function(req,email,password,done){
    req.checkBody('email', 'Invalid email').notEmpty().isEmail();//checking that the email is valid
    req.checkBody('password', 'Invalid password').notEmpty().isLength({min:4});//checking that the password shouldn't be less than 4 chars
    var errors = req.validationErrors();//errors from the above two validators
    if(errors){
      var messages = [];
      errors.forEach(function(error){
        messages.push(error.msg);//pushing errors into the messages array
      });
      return done(null, false, req.flash('error', messages));
    }
    User.findOne({'email':email}, function(err,user){
      if(err){
        return done(err);
      }
      if(user){
        return done(null,false, {message:'Email is Already in Use'});
      }
      var newUser = new User();
      newUser.email = email;
      newUser.password = newUser.encryptPassword(password);
      newUser.save(function(err,result){
        if(err){
          return done(err);
        }
        return done(null,newUser);
      });
    });
}));

//implementing Sign-in
passport.use('local.signin', new LocalStrategy({
  usernameField: 'email',
  password: 'password',
  passReqToCallback: true
}, function(req,email, password, done){
  //validation
  req.checkBody('email', 'Invalid email').notEmpty().isEmail();//checking that the email is valid
  req.checkBody('password', 'Invalid password').notEmpty();//checking that the password shouldn't be less than 4 chars
  var errors = req.validationErrors();//errors from the above two validators
  if(errors){
    var messages = [];
    errors.forEach(function(error){
      messages.push(error.msg);//pushing errors into the messages array
    });
    return done(null, false, req.flash('error', messages));
  }

  User.findOne({'email':email}, function(err,user){
    if(err){
      return done(err);
    }
    if(!user){
      return done(null,false, {message:'No user found'});
    }
    if(!user.validPassword(password)){//this function was declared in the user model
        return done(null,false, {message:'Wrong password'});
    }

    return done(null,user);
    });

}));
