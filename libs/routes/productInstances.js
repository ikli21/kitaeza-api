var express = require('express');
var passport = require('passport');
const product = require('../model/product');
const productInstance = require('../model/productInstance');
var router = express.Router();

var libs = process.cwd() + '/libs/';
var log = require(libs + 'log')(module);
var auth = require("./auth");
var db = require(libs + 'db/mongoose');
var ProductInstance = require(libs + 'model/productInstance');

// List all baskets
router.get('/', auth.required, function (req, res) {

    ProductInstance.find(function (err, productInstance) {
        if (!err) {
            return res.json(productInstance);
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

    var productInstance = new ProductInstance({
        // user: req.body.user,
        // author: req.body.author,
        product: req.body.product,
    order: req.body.order,
    basket: req.body.basket,
    amount:req.body.amount,
    
    });

    productInstance.save(function (err) {
        if (!err) {
            log.info('New productInstance created with id: %s', productInstance.id);
            return res.json({
                status: 'OK',
                productInstance: productInstance
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

    ProductInstance.findById(req.params.id, function (err, productInstance) {

        if (!productInstance) {
            res.statusCode = 404;

            return res.json({
                error: 'Not found'
            });
        }

        if (!err) {
            return res.json({
                status: 'OK',
                productInstance: productInstance
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
    var productInstanceId = req.params.id;

    ProductInstance.findById(productInstanceId, function (err, productInstance) {
        if (!productInstance) {
            res.statusCode = 404;
            log.error('ProductInstance with id: %s Not Found', productInstanceId);
            return res.json({
                error: 'Not found'
            });
        }

        product= req.body.product;
    order= req.body.order;
    basket= req.body.basket;
    amount=req.body.amount;
    
        // article.author = req.body.author;
        // article.images = req.body.images;

        producInstance.save(function (err) {
            if (!err) {
                log.info('ProductInstance with id: %s updated', productInstance.id);
                return res.json({
                    status: 'OK',
                    productInstance: productInstance
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