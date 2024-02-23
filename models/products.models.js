const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
    {
    name: {
        type: String,
        required: [true , "Name is required"]
    },
    price: {
        type: Number,
        required: true,
        default: 0
    },

    quantity: {
        type: Number,
        required: true,
        default: 0
    },

    image :{
        type: String,
        required: false
    }
});

productSchema.set('timestamps', true);



const Product = mongoose.model('Product', productSchema);

module.exports = Product;
