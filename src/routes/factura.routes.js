'use strict'

const facturController = require('../controllers/factura.controller');
const express = require('express');
const api = express.Router();
const mdAuth = require('../services/authenticated');

api.get('/prueba', [mdAuth.ensureAuth, mdAuth.isAdmin], facturController.prueba);
api.get('/saveBuy', mdAuth.ensureAuth, facturController.saveBuy);

module.exports = api;