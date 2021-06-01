var express = require('express');
var passport = require('passport');
const user = require('../model/user');
var router = express.Router();

var libs = process.cwd() + '/libs/';
var log = require(libs + 'log')(module);

var db = require(libs + 'db/mongoose');
var User = require(libs + 'model/user');

// router.post('/',
// function(req,res){
//     var user = new User({
//         // user: req.body.user,
//         // author: req.body.author,
//         username: req.body.username,
        
//         hashedPassword: req.body.hashedPassword,
        
//         //// status:
//         // images: req.body.images
//     });
//     User.findOne({username:req.body.username}, function(err,userSearched){
        
//         if(!userSearched){
//             user.save(function (err) {
//                 if (!err) {
//                     log.info('Успешная регистрация пользователя с id: %s', user.id);
//                     return res.json({
//                         status: 'OK',
//                         user: user
//                     });
//                 } else {
//                     if (err.name === 'ValidationError') {
//                         res.statusCode = 400;
//                         res.json({
//                             error: 'Validation error'
//                         });
//                     } else {
//                         res.statusCode = 500;
        
//                         log.error('Internal error(%d): %s', res.statusCode, err.message);
        
//                         res.json({
//                             error: 'Server error'
//                         });
//                     }
//                 }
//             });
//         }
//         else{
//             res.json({
//                 err:'Пользователь с таким именем уже существует'
//             });
//         }

//     });

    
// });
module.exports = router;