var libs = process.cwd() + '/libs/';
var async = require('async');
var log = require(libs + 'log')(module);
var async = require('async');
var express = require('express');
var passport = require('passport');
var router = express.Router();
var log = require(libs + 'log')(module);
var auth = require(libs+"routes/auth");
var db = require(libs + 'db/mongoose');
var Category = require(libs + 'model/category');
var ProductCharacteristics = require(libs + 'model/productCharacteristics');
const Order = require(libs+"model/order");
const Product = require(libs+"model/product");
const ProductInstance = require(libs+"model/productInstance");
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const User = mongoose.model('User');

exports.characteristics_list_get = function (req, res) {

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
}

exports.characteristics_product_id_get = function (req, res) {

    ProductCharacteristics.find({"product":req.params.productId}, function (err, productCharacteristics) {
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
}

exports.characteristics_create_post = function (req, res) {

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
}

exports.characteristics_id_get = function (req, res) {

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
}

exports.characteristics_id_put = function (req, res) {
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
}