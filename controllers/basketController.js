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
const { json } = require('body-parser');
// const { resolve } = require('path/posix');
const e = require('express');
const User = mongoose.model('User');
var MongoClient = require('mongodb').MongoClient;
var url="mongodb+srv://defuser:1234@kitaezaapidb.tg8rf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

exports.baskets_list_get = function (req, res) {

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
}
exports.baskets_user_get = function (req, res) {

    Basket.find({"user":req.params.userId},function (err, baskets) {
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
}

exports.basket_create_post = function (req, res) {

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
}

exports.baskets_from_instances_product = async function (req, res) {
        await ProductInstance.find({"basket":req.params.basketId},async function (err, productInstances) {
            if (!err) {
                let pinst=await ProductInstance.findOne({"basket":req.params.basketId},function(err,prodInst){if(prodInst!=null){
                    let bid= prodInst.basket;
                    // log.info(pinst);
                    var data = MongoClient.connect(url, function(err, client) {
                    if (err) throw err;
                    
                    var db = client.db('myFirstDatabase')
                    db.collection('productinstances').aggregate([
                    {$match:{basket:bid}},
                    
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

exports.basket_to_order_create_post = function(req,res){
    // const { payload: { id } } = req;
    // let currenUserId = req.body.userId;
    
    // User.findById(id)
    // .then((user) => {
    //   if(!user) {
    //     return res.sendStatus(400);
    //   }

    //   emailUser = user.email;
    // });
    let amountCount;
    let emailInstanceImage="test";
    let emailUser="test";
    var userId = "testId";
    let table = '<table class="mainTable"><tr><th>Наименование</th><th>Изображение</th><th>Количество</th></tr>';
    // await Promise.all([addOrder(), sendMail()]);
    async function addOrder(mSecs){
        return new Promise((resolve,reject)=>{
            Basket.findById(req.body.basketId, async function (err, basket) {
                if (!basket) {
                    res.statusCode = 404;
        
                    return res.json({
                        error: 'Basket Not found'
                    });
                }
    
                if (!err) {
                    
                    userId= basket.user;
                    await User.findById(userId,async function (err,user){
                        if(!user){
                            res.statusCode =404;
                            return res.json({
                                error:"User not found"
                            });
                        }
                        if(!err){
                            emailUser = user.email;
                        }
                    });
        
                    
                    var order = new Order({
                        // user: req.body.user,
                        // author: req.body.author,
                        user:userId,
                        //// status:
                        // images: req.body.images
                    });
                
                    await order.save(async function (err) {
                        if (!err) {
                            log.info('New order created with id: %s', order.id);
                            await ProductInstance.find({"basket":basket.id},async function (err, productInstance) {
                                if (!err) {
                                    productInstance.forEach(async element  => {
                                        element.basket = null;
                                        element.order = order.id;
                                        amountCount+=element.amount;
                                        await element.save(async function (err){
                                            if(!err) {
                                                log.info('productInstance updated, id:',element.id);
                                                let productId = element.product;
                                                await Product.findById(productId,async function (err, product) {
        
                                                    if (!product) {
                                                        res.statusCode = 404;
                                            
                                                        return res.json({
                                                            error: 'Product Not found'
                                                        });
                                                    }
                                            
                                                    if (!err) {
                                                        emailInstanceImage = product.imageurl;
                                                        product.amount = product.amount - element.amount;
                                                        await product.save(async function (err){
                                                            if(!err) {
                                                                log.info('product updated, id:',product.id);
                                                                table += ('<tr>');
                                                            table += ('<td>' + product.title + '</td>');
                                                            table += ('<td><img src="' + product.imageurl + '"></td>');
                                                            table += ('<td>' + element.amount + '</td>');
                                                            table += ('</tr>');
                                                            log.info(table);
                                                            // await new Promise((resolve, reject) => setTimeout(resolve, 3000));
                                                            // return table;
                                                            setTimeout(() => {
                                                                resolve();
                                                            }, mSecs);
                                                            
                                                            }
                                                            else {
                                                                if (err.name === 'ValidationError') {
                                                                    res.statusCode = 400;
                                                                    reject();
                                                                    res.json({
                                                                        error: 'Validation error 1'
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
                                                     
                                            else {
                                                res.statusCode = 500;
                                                log.error('Internal error(%d): %s', res.statusCode, err.message);
                                    
                                                return res.json({
                                                    error: 'Server error'
                                                });
                                            }
                                        });
                                            }
                                            else {
                                                if (err.name === 'ValidationError') {
                                                    res.statusCode = 400;
                                                    res.json({
                                                        error: err
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
                                    
                                } else {
                                    res.statusCode = 500;
                        
                                    log.error('Internal error(%d): %s', res.statusCode, err.message);
                        
                                    return res.json({
                                        error: 'Server error'
                                    });
                                }
                            });
                        } else {
                            if (err.name === 'ValidationError') {
                                res.statusCode = 400;
                                res.json({
                                    error: 'Validation error 3'
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
                //        //emailSender
                       
                }
                else {
                    res.statusCode = 500;
                    log.error('Internal error(%d): %s', res.statusCode, err.message);
        
                    return res.json({
                        error: 'Server error'
                    });
                }
                
            });
        });
        
    
        
    }
    async function  sendEmail(){
        // let promise =  new Promise((resolve, reject) => setTimeout(resolve(addOrder()), 3000));

        // let table = await promise;
        await addOrder(3000);
        let output = `
        <p>У вас новый заказ!</p>
        <h3>Контактные данные</h3>
        <ul>
        <li>Компания: ИП Аверьянов Д.О.</li>
        <li>Email: kitaeza@mail.ru</li>
        <li>Телефон: 89228281855</li>
        </ul>
        <h3>Сообщение</h3>
        <p>Ваш заказ успешно зарезервирован</p>
        `+table+('</table>');
        log.info(output);
        let smtpTransport;
        try {
            smtpTransport = nodemailer.createTransport({
            host:"smtp.mail.ru",
            port:465,
            secure:true,
            auth: {
                user: "sergej.sergeevbo@mail.ru",
                pass: "17klop3d8"
            }
            });
        } catch (e) {
            return console.log('Error: ' + e.name + ":" + e.message);
        }
        
        let mailOptions = {
            from: 'sergej.sergeevbo@mail.ru', 
            to: emailUser, 
            subject: 'У вас новый заказ!', 
            text: 'Пожалуйста свяжитесь с нами, если это ваш заказ',
            html: output
        };
        
        smtpTransport.sendMail(mailOptions, (error, info) => {
            if (error) {
            return console.log(error);
         //    return console.log('Error');
            } else {
            console.log('Message sent: %s', info.messageId);
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
            }
        res.render('feed-ok', {msg: 'В ближайшее время мы с Вами свяжемся и ответим на все вопросы'});
        res.redirect('http://kitaeza-api.herokuapp/api');
    });
    return res.json({
        status:"ok"
    });
    }
    //Как вариант
    // addOrder().then(sendEmail(),log.info("Error"));
    sendEmail();
    
    

    
    
// return res.json({status:'OK'});
}

exports.basket_id_get = function (req, res) {

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
}

exports.basket_id_put = function (req, res) {
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
}