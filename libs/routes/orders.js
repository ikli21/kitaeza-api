var express = require('express');
var passport = require('passport');
var router = express.Router();

var libs = process.cwd() + '/libs/';
var log = require(libs + 'log')(module);
var auth = require("./auth");
var db = require(libs + 'db/mongoose');
var Order = require(libs + 'model/order');

// List all baskets
router.get('/', function (req, res) {

    Order.find(function (err, order) {
        if (!err) {
            return res.json(order);
        } else {
            res.statusCode = 500;

            log.error('Internal error(%d): %s', res.statusCode, err.message);

            return res.json({
                error: 'Server error'
            });
        }
    });
});

// List all baskets
router.get('/ordersbyuser',  function (req, res) {

    Order.find({"user":req.body.userId}, function (err, order) {
        if (!err) {
            return res.json(order);
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

    var order = new Order({
        // user: req.body.user,
        // author: req.body.author,
        user:req.body.user,
        //// status:
        // images: req.body.images
    });

    order.save(function (err) {
        if (!err) {
            log.info('New order created with id: %s', order.id);
            return res.json({
                status: 'OK',
                order: order
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
router.get('/:id',  function (req, res) {

    Order.findById(req.params.id, function (err, order) {

        if (!order) {
            res.statusCode = 404;

            return res.json({
                error: 'Not found'
            });
        }

        if (!err) {
            return res.json({
                status: 'OK',
                order: order
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
    var orderId = req.params.id;

    Order.findById(orderId, function (err, order) {
        if (!order) {
            res.statusCode = 404;
            log.error('Order with id: %s Not Found', orderId);
            return res.json({
                error: 'Not found'
            });
        }

        order.user = req.body.user;
        ////status:
        // article.author = req.body.author;
        // article.images = req.body.images;

        order.save(function (err) {
            if (!err) {
                log.info('order with id: %s updated', order.id);
                return res.json({
                    status: 'OK',
                    order: order
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