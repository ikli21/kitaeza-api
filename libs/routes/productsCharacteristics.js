var express = require('express');
var passport = require('passport');
var router = express.Router();

var libs = process.cwd() + '/libs/';
var log = require(libs + 'log')(module);
var auth = require("./auth");
var db = require(libs + 'db/mongoose');
var ProductCharacteristics = require(libs + 'model/productCharacteristics');

// List all baskets
router.get('/',  function (req, res) {

    ProductCharacteristics.find(function (err, productCharacteristics) {
        if (!err) {
            return res.json(productCharacteristics);
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
router.get('/productCharacteristicsbyproduct',  function (req, res) {

    ProductCharacteristics.find({"product":req.body.product}, function (err, productCharacteristics) {
        if (!err) {
            return res.json(productCharacteristics);
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

    var productCharacteristics = new ProductCharacteristics({
        // user: req.body.user,
        // author: req.body.author,
        characName:req.body.characName,
        product:req.body.product,
        description:req.body.description
        //// status:
        // images: req.body.images
    });

    productCharacteristics.save(function (err) {
        if (!err) {
            log.info('New productCharacteristics created with id: %s', productCharacteristics.id);
            return res.json({
                status: 'OK',
                productCharacteristics: productCharacteristics
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

    ProductCharacteristics.findById(req.params.id, function (err, productCharacteristics) {

        if (!productCharacteristics) {
            res.statusCode = 404;

            return res.json({
                error: 'Not found'
            });
        }

        if (!err) {
            return res.json({
                status: 'OK',
                productCharacteristics: productCharacteristics
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
    var productCharacteristicsId = req.params.id;

    ProductCharacteristics.findById(productCharacteristicsId, function (err, productCharacteristics) {
        if (!productCharacteristics) {
            res.statusCode = 404;
            log.error('ProductCharacteristics with id: %s Not Found', productCharacteristicsId);
            return res.json({
                error: 'Not found'
            });
        }

        productCharacteristics.product = req.body.product;
        productCharacteristics.characName = req.body.characName;
        productCharacteristics.description = req.body.description;
        ////status:
        // article.author = req.body.author;
        // article.images = req.body.images;

        productCharacteristics.save(function (err) {
            if (!err) {
                log.info('productCharacteristics with id: %s updated', productCharacteristics.id);
                return res.json({
                    status: 'OK',
                    productCharacteristics: productCharacteristics
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