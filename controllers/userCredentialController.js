var libs = process.cwd() + '/libs/';

var log = require(libs + 'log')(module);
var async = require('async');
var express = require('express');
var passport = require('passport');
const { findOne } = require('../libs/model/userCredential');
// const userCredential = require('../model/userCredential');
var router = express.Router();
var auth = require(libs+"routes/auth");
var db = require(libs + 'db/mongoose');
var UserCredential = require(libs + 'model/userCredential');
var controllers = process.cwd() + '/controllers/';
var user_controller = require(controllers+'userController');

exports.credentials_id_get = function (req, res) {

    UserCredential.findById(req.params.id, function (err, userCredential) {

        if (!userCredential) {
            res.statusCode = 404;

            return res.json({
                error: 'Not found'
            });
        }

        if (!err) {
            return res.json({
                status: 'OK',
                userCredential: userCredential
            });
        } else {
            res.statusCode = 500;
            log.error('Internal error(%d): %s', res.statusCode, err.message);

            return res.json({
                error: 'Server error'
            });
        }
    });
}

exports.credentials_id_user_get = function (req, res) {

    UserCredential.findOne({"user":req.params.userId}, function (err, userCredential) {

        if (!userCredential) {
            res.statusCode = 404;

            return res.json({
                error: 'Not found'
            });
        }

        if (!err) {
            return res.json({
                status: 'OK',
                userCredential: userCredential
            });
        } else {
            res.statusCode = 500;
            log.error('Internal error(%d): %s', res.statusCode, err.message);

            return res.json({
                error: 'Server error'
            });
        }
    });
}

// exports.credentials_email_user_get = function (req, res) {
//     let user = user_controller.user_current_get;
//     UserCredential.find({}req.params.email, function (err, userCredential) {

//         if (!userCredential) {
//             res.statusCode = 404;

//             return res.json({
//                 error: 'Not found'
//             });
//         }

//         if (!err) {
//             return res.json({
//                 status: 'OK',
//                 userCredential: userCredential
//             });
//         } else {
//             res.statusCode = 500;
//             log.error('Internal error(%d): %s', res.statusCode, err.message);

//             return res.json({
//                 error: 'Server error'
//             });
//         }
//     });
// }

exports.credentials_list_get = function (req, res) {

    UserCredential.find(function (err, userCredential) {
        if (!err) {
            return res.json(userCredential);
        } else {
            res.statusCode = 500;

            log.error('Internal error(%d): %s', res.statusCode, err.message);

            return res.json({
                error: 'Server error'
            });
        }
    });
}

exports.credentials_create_post = function (req, res) {

    var userCredential = new UserCredential({
        // user: req.body.user,
        // author: req.body.author,
        user: req.body.user,
    email: req.body.email,
    vkontakte: req.body.vkontakte,
    name: req.body.name,
    surname: req.body.surname,
    telegram:req.body.telegram,
    whatsapp:req.body.whatsapp,
        viber: req.body.viber, 
        imageurl:req.body.imageurl
    });

    userCredential.save(function (err) {
        if (!err) {
            log.info('New userCredential created with id: %s', userCredential.id);
            return res.json({
                status: 'OK',
                userCredential: userCredential
            });
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
}

exports.credentials_id_put = function (req, res) {
    var userCredentialId = req.params.id;
    const { payload: { email } } = req;
    // log.info(role);
    // if(role!=='Админ'||role==null){
    //     return res.json({error:'Вы не администратор, чтобы выполнять данный запрос'})
    // }
    UserCredential.findById(userCredentialId, function (err, userCredential) {
        if (!userCredential) {
            res.statusCode = 404;
            log.error('UserCredential with id: %s Not Found', userCredential);
            return res.json({
                error: 'Not found'
            });
        }

        userCredential.email= email;
    userCredential.viber= req.body.viber;
    userCredential.telegram= req.body.telegram;
   userCredential.name = req.body.name;
   userCredential.surname = req.body.surname;
    userCredential.whatsapp=req.body.whatsapp;
    userCredential.vkontakte=req.body.vkontakte;
        userCredential.imageurl = req.body.imageurl;
        // article.author = req.body.author;
        // article.images = req.body.images;

        userCredential.save(function (err) {
            if (!err) {
                log.info('UserCredential with id: %s updated', userCredential.id);
                return res.json({
                    status: 'OK',
                    userCredential: userCredential
                });
            } else {
                if (err.name === 'ValidationError') {
                    res.statusCode = 400;
                    return res.json({
                        error: 'Validation error'
                    });
                } else {
                    res.statusCode = 500;

                    return res.json({
                        error: 'Server error'
                    });
                }
                log.error('Internal error (%d): %s', res.statusCode, err.message);
            }
        });
    });
}