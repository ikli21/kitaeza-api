var express = require('express');
var passport = require('passport');
var router = express.Router();

var libs = process.cwd() + '/libs/';
var log = require(libs + 'log')(module);
var auth = require("./auth");
var db = require(libs + 'db/mongoose');
var Basket = require(libs + 'model/basket');

// List all baskets
router.get('/', auth.required, function (req, res) {

    Basket.find(function (err, baskets) {
        if (!err) {
            return res.json(baskets);
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

    var basket = new Basket({
        user: req.body.user,
        // author: req.body.author,
        // description: req.body.description,
        // images: req.body.images
    });

    basket.save(function (err) {
        if (!err) {
            log.info('New basket created with id: %s', basket.id);
            return res.json({
                status: 'OK',
                basket: basket
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

    Basket.findById(req.params.id, function (err, basket) {

        if (!basket) {
            res.statusCode = 404;

            return res.json({
                error: 'Not found'
            });
        }

        if (!err) {
            return res.json({
                status: 'OK',
                basket: basket
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
    var basketId = req.params.id;

    Basket.findById(basketId, function (err, basket) {
        if (!basket) {
            res.statusCode = 404;
            log.error('Basket with id: %s Not Found', basketId);
            return res.json({
                error: 'Not found'
            });
        }

        basket.user = req.body.user;
        // article.description = req.body.description;
        // article.author = req.body.author;
        // article.images = req.body.images;

        basket.save(function (err) {
            if (!err) {
                log.info('Basket with id: %s updated', basket.id);
                return res.json({
                    status: 'OK',
                    basket: basket
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
