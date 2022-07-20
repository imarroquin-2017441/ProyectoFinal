'use strict'

const User = require('../models/user.model');
const Product = require('../models/product.model');
const Category = require('../models/user.model');
const bcrypt = require('bcrypt-nodejs');

exports.validateData = (data)=>{
    let keys = Object.keys(data), msg = '';
    for(let key of keys){
        if(data[key] !== null && data[key] !== undefined && data[key] !== '') continue; 
        msg += `El parámetro ${key} es obligatorio \n`;     
    }
    return msg.trim();
}

exports.alreadyUser = async (username)=>{
    try{
        let exist = User.findOne({username: username}).lean();
        return exist;
    }catch(err){
        console.log(err);
        return err;
    }
}

exports.alreadyProduct = async (name)=>{
    try{
        let exist = Product.findOne({name: name}).lean();
        return exist;
    }catch(err){
        console.log(err);
        return err;
    }
}

exports.alreadyCategory = async (name)=>{
    try{
        let exist = Category.findOne({name: name}).lean();
        return exist;
    }catch(err){
        console.log(err);
        return err;
    }
}

exports.encrypt = async (password)=>{
    try{
        return bcrypt.hashSync(password);
    }catch(err){
        console.log(err);
        return err;
    }
}

exports.checkPassword = async (password, hash)=>{
    try{
        return bcrypt.compareSync(password, hash);
    }catch(err){
        console.log(err);
        return err;
    }
}

exports.checkPermission = async (userId, sub)=>{
    try{
        if(userId != sub)
            return false;
        else    
            return true;
    }catch(err){
        console.log(err);
        return err;
    }
}

exports.checkUpdate = async (user)=>{
    try{
        if(user.password || Object.entries(user).lenght === 0 || user.role){
            return false;
        }else{
            return true;
        }
    }catch(err){
        console.log(err);
        return err;
    }
}