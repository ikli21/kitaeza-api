var libs = process.cwd() + '/libs/';
var Category = require(libs+'/model/category');

var log = require(libs + 'log')(module);
var async = require('async');
// var Book = require('../models/book');
// Показать список всех авторов.
exports.category_list = async function(req, res, next) {

    await Category.find(function (err, category) {
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
  };
  exports.category_create_post = async function (req, res) {
    const { payload: { role } } = req;
    log.info(role);
    if(role!=='Админ'||role==null){
        return res.json({error:'Вы не администратор, чтобы выполнять данный запрос'})
    }
    var category = new Category({
        // user: req.body.user,
        // author: req.body.author,
        title:req.body.title,
        description: req.body.description,
        // images: req.body.images
    });

    await category.save(function (err) {
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
}
exports.category_id_get = async function (req, res) {
    var categoryId = req.params.id;
    await Category.findById(categoryId, function (err, category) {

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
}
exports.category_id_update_put = async function (req, res) {
    var categoryId = req.params.id;
    const { payload: { role } } = req;
    log.info(role);
    if(role!=='Админ'||role==null){
        return res.json({error:'Вы не администратор, чтобы выполнять данный запрос'})
    }
    await Category.findById(categoryId,async function (err, category) {
        if (await !category) {
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

        await category.save(async function (err) {
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
}


























// // Показать подробную страницу для данного автора.
// // Display detail page for a specific Author.
// // exports.author_detail = function(req, res, next) {

// //     async.parallel({
// //         author: function(callback) {
// //             Author.findById(req.params.id)
// //               .exec(callback)
// //         },
// //         authors_books: function(callback) {
// //           Book.find({ 'author': req.params.id },'title summary')
// //           .exec(callback)
// //         },
// //     }, function(err, results) {
// //         if (err) { return next(err); } // Error in API usage.
// //         if (results.author==null) { // No results.
// //             var err = new Error('Author not found');
// //             err.status = 404;
// //             return next(err);
// //         }
// //         // Successful, so render.
// //         res.render('author_detail', { title: 'Author Detail', author: results.author, author_books: results.authors_books } );
// //     });

// // };

// // Показать форму создания автора по запросу GET.
// exports.author_create_get = function(req, res) {
//     res.send('NOT IMPLEMENTED: Author create GET');
// };

// // Создать автора по запросу POST.
// exports.author_create_post = function(req, res) {
//     res.send('NOT IMPLEMENTED: Author create POST');
// };

// // Показать форму удаления автора по запросу GET.
// exports.author_delete_get = function(req, res) {
//     res.send('NOT IMPLEMENTED: Author delete GET');
// };

// // Удалить автора по запросу POST.
// exports.author_delete_post = function(req, res) {
//     res.send('NOT IMPLEMENTED: Author delete POST');
// };

// // Показать форму обновления автора по запросу GET.
// exports.author_update_get = function(req, res) {
//     res.send('NOT IMPLEMENTED: Author update GET');
// };

// // Обновить автора по запросу POST.
// exports.author_update_post = function(req, res) {
//     res.send('NOT IMPLEMENTED: Author update POST');
// };
