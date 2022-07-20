'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');
const userRoutes = require('../src/routes/user.routes');
const productRoutes = require('../src/routes/product.routes');
const cateRoutes = require('../src/routes/category.routes');
const carriRoutes = require('../src/routes/carrito.routes');
const FactuRoutes = require('../src/routes/factura.routes');

const app = express();

app.use(helmet());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors());
app.use('/user', userRoutes);
app.use('/product', productRoutes);
app.use('/category', cateRoutes);
app.use('/carrito', carriRoutes);
app.use('/factura', FactuRoutes);

module.exports = app;