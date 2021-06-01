var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// var Image = new Schema({
//     kind: {
//         type: String,
//         enum: ['thumbnail', 'detail'],
//         required: true
//     },
//     url: { type: String, required: true }
// });

var Order = new Schema({
    
    // productInstance: {type: Schema.ObjectId, ref: 'ProductInstance', required: true},
    user: {type: Schema.ObjectId, ref: 'User', required: true},
    status: {type: String, required: true, enum: ['В обработке', 'Отклонен', 'Одобрен'], default: 'В обработке'},
    // order: {type: Schema.ObjectId, ref: 'Order', required: true},
    // basket: {type: Schema.ObjectId, ref: 'Basket', required: true},
    // amount:{type:Int32Array,required:true,default:0},
    modified: { type: Date, default: Date.now }
});

// Product.path('title').validate(function (v) {
//     return v.length > 5 && v.length < 70;
// });

module.exports = mongoose.model('Order', Order);