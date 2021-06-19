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

exports.instances_list_get = async function (req, res) {

    await ProductInstance.find(function (err, productInstance) {
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
}

exports.instances_order_get = async function (req, res) {

    await ProductInstance.find({"order":req.params.orderId},function (err, productInstance) {
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
}

exports.instances_basket_get = async function (req, res) {

    await ProductInstance.find({"basket":req.params.basketId},function (err, productInstance) {
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
}

exports.instances_create_post = async function (req, res) {

    var productInstance = new ProductInstance({
        // user: req.body.user,
        // author: req.body.author,
        product: req.body.product,
    order: req.body.order,
    basket: req.body.basket,
    amount:req.body.amount,
    
    });

    await productInstance.save(async function (err) {
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
}

exports.instances_id_get = async function (req, res) {

    await ProductInstance.findById(req.params.id,async function (err, productInstance) {

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
}

exports.instances_id_put = async function (req, res) {
    var productInstanceId = req.params.id;

    await ProductInstance.findById(productInstanceId,async function (err, productInstance) {
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

        await productInstance.save(async function (err) {
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
}

exports.instances_basket_delete = async function (req, res) {
    // return new Promise()
    var basketId = req.body.basketId;

    await ProductInstance.find({"basket":basketId},async function (err, productInstance) {
        if (!productInstance) {
            res.statusCode = 404;
            log.error('ProductInstances with basketid: %s Not Found', basketId);
            return res.json({
                error: 'Not found'
            });
        }

    //     product= req.body.product;
    // order= req.body.order;
    // basket= req.body.basket;
    // amount=req.body.amount;
    
        // article.author = req.body.author;
        // article.images = req.body.images;
        await productInstance.forEach(async element =>{
            await element.delete(async function (err) {
                if (!err) {
                    log.info('ProductInstance with id: %s deleted', element.id);
                    return res.json({
                        status: 'OK',
                        // productInstance: productInstance
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
}

exports.instances_delete_id = async function (req, res) {
    // return new Promise()
    var productInstanceId = req.body.productInstanceId;

    await ProductInstance.findById(productInstanceId,async function (err, productInstance) {
        if (!productInstance) {
            res.statusCode = 404;
            log.error('ProductInstance with id: %s Not Found', productInstanceId);
            return res.json({
                error: 'Not found'
            });
        }

    //     product= req.body.product;
    // order= req.body.order;
    // basket= req.body.basket;
    // amount=req.body.amount;
    
        // article.author = req.body.author;
        // article.images = req.body.images;

        await productInstance.delete(async function (err) {
            if (!err) {
                log.info('ProductInstance with id: %s deleted', productInstance.id);
                return res.json({
                    status: 'OK',
                    // productInstance: productInstance
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