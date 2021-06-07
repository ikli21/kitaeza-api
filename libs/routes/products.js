var express = require('express');
var passport = require('passport');
const product = require('../model/product');
var router = express.Router();

var libs = process.cwd() + '/libs/';
var log = require(libs + 'log')(module);
var auth = require("./auth");
var db = require(libs + 'db/mongoose');
var Product = require(libs + 'model/product');
var Category = require(libs+'model/category')
// List all baskets
router.get('/',  function (req, res) {

    Product.find(function (err, product) {
        if (!err) {
            return res.json(product);
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

    var product = new Product({
        // user: req.body.user,
        // author: req.body.author,
        title: req.body.title,
    category: req.body.category,
    description: req.body.description,
   
    price:req.body.price,
    amount:req.body.amount,
        imageurl: req.body.imageurl
    });

    product.save(function (err) {
        if (!err) {
            log.info('New product created with id: %s', product.id);
            return res.json({
                status: 'OK',
                product: product
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

    Product.findById(req.params.id, function (err, product) {

        if (!product) {
            res.statusCode = 404;

            return res.json({
                error: 'Not found'
            });
        }

        if (!err) {
            return res.json({
                status: 'OK',
                product: product
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
router.get('/productCategory/:categoryId',  function (req, res) {

    Product.find({"category":req.params.categoryId}, function (err, product) {
        if (!err) {
            return res.json(product);
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
    var productId = req.params.id;

    Product.findById(productId, function (err, product) {
        if (!product) {
            res.statusCode = 404;
            log.error('Product with id: %s Not Found', productId);
            return res.json({
                error: 'Not found'
            });
        }

        product.title= req.body.title;
    product.category= req.body.category;
    product.description= req.body.description;
   
    product.price=req.body.price;
    product.amount=req.body.amount;
        product.imageurl= req.body.imageurl;
        // article.author = req.body.author;
        // article.images = req.body.images;

        product.save(function (err) {
            if (!err) {
                log.info('Product with id: %s updated', product.id);
                return res.json({
                    status: 'OK',
                    product: product
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