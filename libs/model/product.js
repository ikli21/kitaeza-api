var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Image = new Schema({
    kind: {
        type: String,
        enum: ['thumbnail', 'detail'],
        required: true
    },
    url: { type: String, required: true }
});

var Product = new Schema({
    title: { type: String, required: true },
    category: {type: Schema.ObjectId, ref: 'Category', required: true},
    description: { type: String, required: true },
    images: [Image],
    price:{type:Number,required:true},
    amount:{type:Number,required:true,default:0},
    modified: { type: Date, default: Date.now }
});

Product.path('title').validate(function (v) {
    return v.length > 5 && v.length < 70;
});

module.exports = mongoose.model('Product', Product);