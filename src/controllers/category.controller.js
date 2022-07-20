'use strict'

const Category = require('../models/category.model');
const Product = require('../models/product.model');

const { alreadyCategory, validateData, checkUpdate } = require('../utils/validate');

exports.prueba = (req, res)=>{
    return res.send({message: 'La funcion prueba esta ejecutandose'});
};

exports.saveCategory = async(req, res)=>{
    try{
        const params = req.body;
        const data = {
            name: params.name,
        }
        
        const msg = validateData(data);

        if(!msg){
            let cateExist = await alreadyCategory(params.name);
            if(!cateExist){
                let cate = new Category(data);
                await cate.save();
                return res.send({message: 'La categoria se agrego'})
            }else{
                return res.send({message: 'El nombre de la categoria ya esta en uso'});
            }
        }else{
            return res.status(400).send(msg);
        }
    }catch(err){
        console.log(err);
        return err;
    }
}

exports.getCategories = async(req, res)=>{
    try{
        const categories = await Category.find();
        return res.send(categories);
    }catch(err){
        console.log(err);
        return err;
    }
}

exports.updateCategories = async(req, res)=>{
    try{
        const params = req.body;
        const categoryId = req.params.id;
        const check = await checkUpdate(params);
        if(check === false){
            return res.status(400).send({message: 'Data no recibida'});
        }else{
            const updateCate = await Category.findOneAndUpdate({_id: categoryId}, params, {new: true});
            return res.send({message: 'Categoria actualizada', updateCate});
        }
    }catch(err){
        console.log(err);
        return err;
    }
}

exports.deleteCategory = async(req, res)=>{
    try{
        const categoryDef = await Category.findOne({name: 'default'})
        const categoryId = req.params.id;
        const cateExist = await Category.findOne({_id: categoryId});
        if (cateExist){
            const productCategory = await Category.find({category:categoryId});
            if(!productCategory){
                await Category.findOneAndDelete({_id:categoryId});
                return res.send({message:'Categoria ya eliminada'});
            }else{
                await Product.updateMany({category:categoryId}, {category:categoryDef._id},{multi:true});
                await Category.findByIdAndDelete({_id:categoryId});
                return res.send({message:'Categoria ya eliminada'});
            }
        }else{
            return res.status(404).send('Nose encontro la categoria o ya fue eliminada');
        }
    }catch(err){
        console.log(err);
        return err;
    }
}