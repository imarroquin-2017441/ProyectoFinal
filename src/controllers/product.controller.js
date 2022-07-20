'use strict'

const Product = require('../models/product.model');
const { validateData, alreadyProduct, checkUpdate } = require('../utils/validate');

exports.prueba = (req, res)=>{
    return res.send({message: 'La funcion prueba esta ejecutandose'});
};

exports.saveProduct = async (req, res)=>{
    try{
        const params = req.body;
        const data = {
            name: params.name,
            stock: params.stock,
            price: params.price,
            category: params.category
        }

        const msg = validateData(data);

        if(!msg){
            let productExist = await alreadyProduct(params.name);
            if(!productExist){
                let product = new Product(data);
                await product.save();
                return res.send({message: 'El producto se agrego'});
            }else{
                return res.send({message: 'El nombre del producto ya esta en uso'})
            }
        }else {
            return res.status(400).send(msg);
        }
    }catch(err){
        console.log(err);
        return err;
    }
}

exports.getProducts = async(req, res)=>{
    try{
        const products = await Product.find();
        return res.send({products});
    }catch(err){
        console.log(err);
        return err;
    }
}

exports.getProduct = async(req, res)=>{
    try{
        const productId = req.params.id;
        const product = await Product.findOne({_id: productId});
        if(!product) return res.send({message: 'Producto no encontrado'});
        return res.send({product});
    }catch(err){
        console.log(err);
        return err;
    }
}

exports.searchProduct = async(req, res)=>{
    try{
        const params = req.body;
        const data = {
            name: params.name
        };
        const msg = validateData(data);
        if(!msg){
            const product = await Product.find({name:{$regex: params.name, $options: 'i'}});
            return res.send({product});
        }else{
            return res.status(400).send({msg});
        }
    }catch(err){
        console.log(err);
        return err;
    }
}

exports.updateProduct = async(req, res)=>{
    try {
        const params = req.body;
        const productId = req.params.id;
        const notUpdated = await checkUpdate(params);
        if (notUpdated === false) {
            return res.status(400).send({message: 'Estos parámetros solo son actualizables por Admin'});
        }else{
            const productUpdated = await Product.findOneAndUpdate({_id: productId}, params, {new: true})
            .populate('category')
            .lean();
            return res.send({productUpdated, message: 'Producto actualizado'}); 
        }
    } catch (err) {
        console.log(err);
        return err;
    }
}

exports.deleteProduct = async(req, res)=>{
    try{
        const productId = req.params.id;
        const productDeleted = await Product.findOneAndDelete({_id: productId});
        if(productDeleted) return res.send({productDeleted, message: 'Producto eliminado'});
        return res.send({message: 'No se encontro el producto'})
    }catch(err){
        console.log(err);
        return err;
    }
}
