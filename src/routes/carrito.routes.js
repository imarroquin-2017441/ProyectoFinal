'use strict'

const carritoController = require('../controllers/carrito.controller');
const express = require('express');
const api = express.Router();
const mdAuth = require('../services/authenticated');

api.get('/prueba', [mdAuth.ensureAuth, mdAuth.isAdmin], carritoController.prueba);
api.post('/saveCarrito', mdAuth.ensureAuth, carritoController.saveCarrito);

module.exports = api;