var express = require('express');
var passport = require('passport');
var router = express.Router();

var libs = process.cwd() + '/libs/';
var log = require(libs + 'log')(module);
const auth = require('./auth');
var db = require(libs + 'db/mongoose');
var Category = require(libs + 'model/category');

// List all baskets
router.get('/', function (req, res) {

    Category.find(function (err, category) {
        if (!err) {
            return res.json(category);
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

    var category = new Category({
        // user: req.body.user,
        // author: req.body.author,
        title:req.body.title,
        description: req.body.description,
        // images: req.body.images
    });

    category.save(function (err) {
        if (!err) {
            log.info('New category created with id: %s', category.id);
            return res.json({
                status: 'OK',
                category: category
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
router.get('/:id', function (req, res) {
    var categoryId = req.params.id;
    Category.findById(categoryId, function (err, category) {

        if (!category) {
            res.statusCode = 404;

            return res.json({
                error: 'Not found'
            });
        }

        if (!err) {
            return res.json({
                status: 'OK',
                category: category
            });
        }
         else {
            res.statusCode = 500;
            log.error('Internal error(%d): %s', res.statusCode, err.message);

            return res.json({
                error: 'Server error'
            });
            // return res.json({
            //     status: 'OK',
            //     category: category
            // });
        }
    });
});

// Update basket
router.put('/:id', auth.required, function (req, res) {
    var categoryId = req.params.id;

    Category.findById(categoryId, function (err, category) {
        if (!category) {
            res.statusCode = 404;
            log.error('Category with id: %s Not Found', categoryId);
            return res.json({
                error: 'Not found'
            });
        }

        category.title = req.body.title;
        category.description = req.body.description;
        // article.author = req.body.author;
        // article.images = req.body.images;

        category.save(function (err) {
            if (!err) {
                log.info('Category with id: %s updated', category.id);
                return res.json({
                    status: 'OK',
                    category: category
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
