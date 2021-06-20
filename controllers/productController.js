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
const Order = require(libs+"model/order");
const Product = require(libs+"model/product");
const ProductInstance = require(libs+"model/productInstance");
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const User = mongoose.model('User');

exports.products_list_get = function (req, res) {

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
}

exports.products_list_ten_get =function (req, res) {

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
    }).sort({subtitle:1}).limit(10);
}

exports.products_create_post = function (req, res) {
    const { payload: { role } } = req;
    log.info(role);
    if(role!=='Админ'||role==null){
        return res.json({error:'Вы не администратор, чтобы выполнять данный запрос'})
    }
    else{
        var product = new Product({
            // user: req.body.user,
            // author: req.body.author,
            subtitle: req.body.subtitle,
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
    }
    
}

exports.products_id_get =function (req, res) {

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
}

exports.products_list_category_get =  function (req, res) {

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
}

exports.products_id_put = function (req, res) {
    var productId = req.params.id;
    const { payload: { role } } = req;
    log.info(role);
    if(role!=='Админ'||role==null){
        return res.json({error:'Вы не администратор, чтобы выполнять данный запрос'})
    }
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
    product.subtitle = req.body.subtitle;
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
}