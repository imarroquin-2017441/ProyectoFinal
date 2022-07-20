'use strict'

const mongoose = require('mongoose');

const cateSchema = mongoose.Schema({
    name: String,
})

module.exports = mongoose.model('Category', cateSchema);