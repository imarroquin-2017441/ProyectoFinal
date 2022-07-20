'use strict'

const mongoose = require('mongoose');

const carritoSchema = mongoose.Schema({
    products: [
        {
        product: {type: mongoose.Schema.ObjectId, ref: 'Product'},
        quantity: Number
        }
    ],
    user: {type: mongoose.Schema.ObjectId, ref: 'User'}
});

module.exports = mongoose.model('Carrito', carritoSchema);