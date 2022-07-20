'use strict'

const cateController = require('../controllers/category.controller');
const express = require('express');
const api = express.Router();
const mdAuth = require('../services/authenticated');

api.get('/prueba',[mdAuth.ensureAuth, mdAuth.isAdmin], cateController.prueba);
api.post('/registerCategory', [mdAuth.ensureAuth, mdAuth.isAdmin], cateController.saveCategory);
api.get('/getCategories', [mdAuth.ensureAuth, mdAuth.isAdmin], cateController.getCategories);
api.put('/updateCategory/:id', [mdAuth.ensureAuth, mdAuth.isAdmin], cateController.updateCategories);
api.delete('/deleteCategory/:id', [mdAuth.ensureAuth, mdAuth.isAdmin], cateController.deleteCategory);

module.exports = api;