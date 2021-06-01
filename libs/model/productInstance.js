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

var ProductInstance = new Schema({
    
    product: {type: Schema.ObjectId, ref: 'Product', required: true},
    order: {type: Schema.ObjectId, ref: 'Order', required: true},
    basket: {type: Schema.ObjectId, ref: 'Basket', required: true},
    amount:{type:Number,required:true,default:0},
    modified: { type: Date, default: Date.now }
});

// Product.path('title').validate(function (v) {
//     return v.length > 5 && v.length < 70;
// });

module.exports = mongoose.model('ProductInstance', ProductInstance);