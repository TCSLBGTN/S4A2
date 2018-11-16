var express = require('express');
var router = express.Router();
var User = require('../models/user');
var path = require('path');
var fs = require('fs');
var ip = require("ip");
var address = ip.address();

// GET route for reading data
router.get('/', function (req, res, next) {
  console.log ( "address");
  return res.render(path.join(__dirname + '/log/index.html'),{addressIP:address});
});


//POST route for updating data
router.post('/', function (req, res, next) {
  // confirm that user typed same password twice
  if (req.body.password !== req.body.passwordConf) {
    var err = new Error('Passwords do not match.');
    err.status = 400;
    res.send("passwords dont match");
    return next(err);
  }

  if (req.body.email &&
    req.body.username &&
    req.body.password &&
    req.body.passwordConf&&
    req.body.emitView) {

    var userData = {
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
      passwordConf: req.body.passwordConf,
      emitView: req.body.emitView,

    }

    User.create(userData, function (error, user) {
      if (error) {
        return next(error);
      } else {
        req.session.userId = user._id;
        return res.redirect('/login');
      }
    });

  } else if (req.body.logemail && req.body.logpassword) {
    User.authenticate(req.body.logemail, req.body.logpassword, function (error, user) {
      if (error || !user) {
        var err = new Error('Wrong email or password.');
        err.status = 401;
        return next(err);
      } else {
        req.session.userId = user._id;
        return res.redirect('/login');
      }
    });
  } else {
    var err = new Error('All fields required.');
    err.status = 400;
    return next(err);
  }
})

// GET route after registering
router.get('/login', function (req, res, next) {
  User.findById(req.session.userId)
    .exec(function (error, user) {
      if (error) {
        return next(error);
      } else {
        if (user === null) {
          var err = new Error('Not authorized! Go back!');
          err.status = 400;
          return next(err);
        } else {
          addressIP = req.connection.remoteAddress;
          console.log(user.emitView);
          if (user.emitView === 'Viewer'){
            console.log(path.join(__dirname ,"../", 'log/viewer.html'));
            res.render(path.join(__dirname ,"../", 'log/viewer.html'), {username:user.username,addressIP:address});
          }
          else{
            console.log(path.join(__dirname ,"../", 'log/emmitter.html'));
          res.render(path.join(__dirname ,"../", 'log/emmitter.html'), {username:user.username,addressIP:address});
          }
          
        }
      }
    });
});

// GET for logout logout
router.get('/logout', function (req, res, next) {
  if (req.session) {
    // delete session object
    req.session.destroy(function (err) {
      if (err) {
        return next(err);
      } else {
        return res.redirect('/');
      }
    });
  }
});





module.exports = router;