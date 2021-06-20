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
var Basket = require(libs + 'model/basket');
const Order = require(libs+"model/order");
const Product = require(libs+"model/product");
const ProductInstance = require(libs+"model/productInstance");
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const User = mongoose.model('User');

exports.orders_list_get = function (req, res) {

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
}

exports.orders_from_instances_product = async function (req, res) {
    await ProductInstance.find({"order":req.params.orderId},async function (err, productInstances) {
        if (!err) {
            let pinst=await ProductInstance.findOne({"order":req.params.orderId},function(err,prodInst){if(prodInst!=null){
                let bid= prodInst.order;
                // log.info(pinst);
                var data = MongoClient.connect(url, function(err, client) {
                if (err) throw err;
                
                var db = client.db('myFirstDatabase')
                db.collection('productinstances').aggregate([
                {$match:{order:bid}},
                
                { $lookup:
                    {
                      from: 'products',
                      localField: 'product',
                      foreignField: '_id',
                      as: 'instanceDetails'
                    }
                  }
                  ]).toArray(function(err, resp) {
                  if (err) throw err;
                  log.info(JSON.stringify(resp));
                  return res.json(resp)
                  client.close();
                });
              });
            }else{return res.json({error:err})}});
            // let bid = pinst.basket;
            
            
        } else {
            // reject();
            res.statusCode = 500;

            log.error('Internal error(%d): %s', res.statusCode, err.message);
            
            return res.json({
                error: 'Server error'
            });
        }
    });
// });

}

exports.orders_user_get = function (req, res) {

    Order.find({"user":req.params.userId}, function (err, order) {
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
}
exports.orders_create_post = function (req, res) {

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
}

exports.order_id_get = function (req, res) {

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
}

exports.orders_id_put = function (req, res) {
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
}
