var express = require('express');
var passport = require('passport');
const userCredential = require('../model/userCredential');
var router = express.Router();

var libs = process.cwd() + '/libs/';
var log = require(libs + 'log')(module);
var auth = require("./auth");
var db = require(libs + 'db/mongoose');
var UserCredential = require(libs + 'model/userCredential');

// List all baskets
router.get('/', passport.authenticate('bearer', { session: false }), function (req, res) {

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
});

// Create basket
router.post('/', auth.required, function (req, res) {

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
        viber: req.body.viber
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
});

// Get basket
router.get('/:id', auth.required, function (req, res) {

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
});

// Update basket
router.put('/:id', auth.required, function (req, res) {
    var userCredentialId = req.params.id;

    UserCredential.findById(userCredentialId, function (err, userCredential) {
        if (!userCredential) {
            res.statusCode = 404;
            log.error('UserCredential with id: %s Not Found', userCredential);
            return res.json({
                error: 'Not found'
            });
        }

        userCredential.email= req.body.email;
    userCredential.viber= req.body.viber;
    userCredential.telegram= req.body.telegram;
   userCredential.name = req.body.name;
   userCredential.surname = req.body.surname;
    userCredential.whatsapp=req.body.whatsapp;
    userCredential.vkontakte=req.body.vkontakte;
        
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
});

module.exports = router;