var express = require('express');
var passport = require('passport');
var router = express.Router();

var libs = process.cwd() + '/libs/';
var log = require(libs + 'log')(module);
var auth = require("./auth");
var db = require(libs + 'db/mongoose');
var Basket = require(libs + 'model/basket');
const Order = require(libs+"model/order");
const Product = require(libs+"model/product");
const ProductInstance = require(libs+"model/productInstance");
const nodemailer = require('nodemailer');
let User = require(libs+"model/user");

// List all baskets
router.get('/', auth.required, function (req, res) {

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
});
// List all baskets by user
router.get('/basketsbyuser', auth.required, function (req, res) {

    Basket.find({"user":req.body.userId},function (err, baskets) {
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
});

// Create basket
router.post('/', auth.required, function (req, res) {

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
});

router.post('/basketToOrderEmailNotify', auth.required,function(req,res){
    // const { payload: { id } } = req;
    // let currenUserId = req.body.userId;
    
    // User.findById(id)
    // .then((user) => {
    //   if(!user) {
    //     return res.sendStatus(400);
    //   }

    //   emailUser = user.email;
    // });
    let emailInstanceImage="test";
    var table = '<table class="mainTable"><tr><th>item</th><th>image</th><th>description</th></tr>';
    Basket.findById(req.body.basketId, function (err, basket) {
        
        if (!basket) {
            res.statusCode = 404;

            return res.json({
                error: 'Basket Not found'
            });
        }

        if (!err) {
            let emailUser="test";
            var userId= basket.user;
            User.findById(userId,function(err,user){
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
        
            order.save(function (err) {
                if (!err) {
                    log.info('New order created with id: %s', order.id);
                    ProductInstance.find({"basket":basket.id},function (err, productInstance) {
                        if (!err) {
                            productInstance.forEach(element => {
                                element.order = order.id;
                                element.save(function (err){
                                    if(!err) {
                                        log.info('productInstance updated, id:',element.id);
                                    }
                                    else {
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
                                let productId = element.product;
                                Product.findById(productId, function (err, product) {

                                    if (!product) {
                                        res.statusCode = 404;
                            
                                        return res.json({
                                            error: 'Product Not found'
                                        });
                                    }
                            
                                    if (!err) {
                                        emailInstanceImage = product.imageurl;
                                        product.amount = product.amount - productInstance.amount;
                                        product.save(function (err){
                                            if(!err) {
                                                log.info('product updated, id:',element.id);
                                            }
                                            else {
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
                                        table += ('<tr>');
                                        table += ('<td>' + product.title + '</td>');
                                        table += ('<td><img src="' + emailInstanceImage + '"></td>');
                                        table += ('<td>' + element.amount + '</td>');
                                        table += ('</tr>');
                                    } else {
                                        res.statusCode = 500;
                                        log.error('Internal error(%d): %s', res.statusCode, err.message);
                            
                                        return res.json({
                                            error: 'Server error'
                                        });
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
        } else {
            res.statusCode = 500;
            log.error('Internal error(%d): %s', res.statusCode, err.message);

            return res.json({
                error: 'Server error'
            });
        }
    });
    table += '</table>';

    //emailSender
    let output = `
    <p>У вас новый заказ!</p>
    <h3>Контактные данные</h3>
    <ul>
      <li>Компания: ИП Аверьянов Д.О.</li>
      <li>Email: kitaeza@mail.ru</li>
      <li>Телефон: 2282228228</li>
    </ul>
    <h3>Сообщение</h3>
    <p>сообщение</p>
      `;
    output = output+table;  
    //   <h3>Headers</h3>
    // <ul>  
    //   <li>cookie: ${req.headers.cookie}</li>
    //   <li>user-agent: ${req.headers["user-agent"]}</li>
    //   <li>referer: ${req.headers["referer"]}</li>
    //   <li>IP: ${req.ip}</li>
    // </ul>
    
      let smtpTransport;
      try {
        smtpTransport = nodemailer.createTransport({
          service:'Gmail',
          auth: {
            user: "sergej.sergeevbo@gmail.com",
            pass: "17klop3d8"
          }
        });
      } catch (e) {
        return console.log('Error: ' + e.name + ":" + e.message);
      }
    
      let mailOptions = {
        from: 'sergej.sergeevbo@gmail.com', // sender address
        to: emailUser, // list of receivers
        subject: 'У вас новый заказ!', // Subject line
        text: 'Пожалуйста свяжитесь с нами, если это ваш заказ', // plain text body
        html: output // html body
      };
    
      smtpTransport.sendMail(mailOptions, (error, info) => {
        if (error) {
          // return console.log(error);
          return console.log('Error');
        } else {
          console.log('Message sent: %s', info.messageId);
          console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        }
    res.render('feed-ok', {msg: 'В ближайшее время мы с Вами свяжемся и ответим на все вопросы'});
    res.redirect('http://baedeker.club');
});
return res.json({status:'OK'});
});

// Get basket
router.get('/:id', auth.required, function (req, res) {

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
});

// Update basket
router.put('/:id', auth.required, function (req, res) {
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
});

module.exports = router;
