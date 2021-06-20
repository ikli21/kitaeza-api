var libs = process.cwd() + '/libs/';
var Category = require(libs+'/model/category');

var log = require(libs + 'log')(module);
var async = require('async');

const mongoose = require('mongoose');
const passport = require('passport');
const router = require('express').Router();
const auth = require(libs+'/routes/auth');
const User = mongoose.model('User');
var UserCredential = require(libs + 'model/userCredential');
var Basket = require(libs + 'model/basket');

exports.user_create_post = async (req, res, next)  => {
  const user = new Object({
    email: req.body.email,
    password: req.body.password
 });
 var credId;
    
    if(!user.email) {
      return res.status(422).json({
        errors: {
          email: 'is required',
        },
      });
    }
  
    if(!user.password) {
      return res.status(422).json({
        errors: {
          password: 'is required',
        },
      });
    }
    await User.findOne({"email":user.email},async function (err, userCheck) {
      if (userCheck!=null) {
          return await res.status(422).json({
            errors: {
              email: 'пользователь с таким email уже существует',
            },
          });
      } else {
        const finalUser = new User(user);
  
        await finalUser.setPassword(user.password);
      
        return await finalUser.save().then(fu=>{
          log.info(fu.id);
          var basket = new Basket({
            user: fu.id,
            // author: req.body.author,
            // description: req.body.description,
            // images: req.body.images
        });
    
        basket.save(function (err) {
            if (!err) {
                log.info('New basket created with id: %s', basket.id);
                var userCred = new UserCredential({email:fu.email,user:fu.id})
                userCred.save(function(err){
                  if(!err){
                    log.info('new usercred created with id:%s', userCred.id);
                    // return credId = userCred.id;
                  }
                  else if(err.name==='ValidationError'){res.statusCode=400;res.json({error:err})}
                  else {res.statusCode=500;log.error('Внутренняя ошибка'+ res.statusCode + err.message);res.json({error:err})}
                });
                // return res.json({
                //     status: 'OK',
                //     basket: basket
                // });
            } else {
                if (err.name === 'ValidationError') {
                    res.statusCode = 400;
                    res.json({
                        error: 'Validation error'
                    });
                } else {
                    res.statusCode = 500;
    
                    log.error('Internal error(%d): %s', res.statusCode, err.message);
    
                    res.json({
                        error: 'Server error'
                    });
                }
            }
        });
         })
          .then(() => res.json({ user: finalUser.toAuthJSON()
            // , credentials:{credId}
          } ));
      }
  });
    
  }
  
  exports.user_login_post =  (req, res, next) => {
    const user = new Object({
      
      email: req.body.email,
      password: req.body.password
    
 });
 var temp = JSON.stringify(user);
 log.info(temp);
  
    if(!user.email) {
      return res.status(422).json({
        errors: {
          email: 'is required',
        },
      });
    }
  
    if(!user.password) {
      return res.status(422).json({
        errors: {
          password: 'is required',
        },
      });
    }
  
    return passport.authenticate('local', { session: false }, (err, passportUser, info) => {
      if(err) {
        return next(err);
      }
  
      if(passportUser) {
        const user = passportUser;
        user.token = passportUser.generateJWT();
  
        return res.json({ user: user.toAuthJSON() });
      }
  
      return status(400).info;
    })(req, res, next);
  }

  exports.user_current_get = (req, res, next) => {
    const { payload: { id } } = req;
  
    return User.findById(id)
      .then((user) => {
        if(!user) {
          return res.sendStatus(400);
        }
  
        return res.json({ user: user.toAuthJSON() });
      });
  }