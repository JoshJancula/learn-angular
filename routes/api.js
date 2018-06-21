var mongoose = require('mongoose');
var passport = require('passport');
var config = require('../config/database');
require('../config/passport')(passport);
var express = require('express');
var jwt = require('jsonwebtoken');
var router = express.Router();
var User = require("../models/user");
var Message = require("../models/message");


router.post('/signup', function(req, res) {
  if (!req.body.username || !req.body.password) {
    res.json({success: false, msg: 'Please pass username and password.'});
  } else {
    var newUser = new User({
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
      bio: req.body.bio,

    });
    // save the user
    newUser.save(function(err) {
      if (err) {
        return res.json({success: false, msg: 'Username already exists.'});
      }
      res.json({success: true, msg: 'Successful created new user.'});
    });
  }
});

router.post('/signin', function(req, res) {
  User.findOne({
    username: req.body.username
  }, function(err, user) {
    if (err) throw err;

    if (!user) {
      res.status(401).send({success: false, msg: 'Authentication failed. User not found.'});
    } else {
      // check if password matches
      user.comparePassword(req.body.password, function (err, isMatch) {
        if (isMatch && !err) {
          // if user is found and password is right create a token
          var token = jwt.sign(user.toJSON(), config.secret);
          // return the information including token as JSON
          res.json({success: true, token: 'JWT ' + token});
        } else {
          res.status(401).send({success: false, msg: 'Authentication failed. Wrong password.'});
        }
      });
    }
  });
});

// get all users
router.get('/users', function(req, res, next) {
    User.find(function (err, users) {
      if (err) return next(err);
      res.json(users);
    });
  });

// // get a single user
// router.get('/users/:id', function(req, res, next) {
//     User.findById(req.params.id, function (err, user) {
//       if (err) return next(err);
//       res.json(user);
//     });
//   });

// route to log new messages
router.post('/message', passport.authenticate('jwt', { session: false}), function(req, res) {
  var token = getToken(req.headers);
  if (token) {
    console.log('token inside post route in api.js: ' + token)
    console.log(req.body);
    var newMessage = new Message({
      authorId: req.body.authorId,
      authorName: req.body.authorName,
      message: req.body.message
    });

    newMessage.save(function(err) {
      if (err) {
        console.log('error returned in newMessage.save: ' + err)
        return res.json({success: false, msg: 'Save message failed.'});
      }
      res.json({success: true, msg: 'Successful created new message.'});
    });
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
});




// route to get all messages
router.get('/messages', function(req, res) { 
    Message.find(function (err, messages) {
      if (err) return next(err);
      res.json(messages);
    });
});

getToken = function (headers) {
  if (headers && headers.authorization) {
    var parted = headers.authorization.split(' ');
    if (parted.length === 2) {
      return parted[1];
    } else {
      return null;
    }
  } else {
    return null;
  }
};

module.exports = router;
