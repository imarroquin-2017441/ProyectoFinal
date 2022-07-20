'use strict'

const Carrito = require('../models/carrito.model');
const Product = require('../models/product.model');
const { validateData } = require('../utils/validate');

exports.prueba = (req, res)=>{
    return res.send({message: 'La funcion prueba esta ejecutandose'});
};

exports.saveCarrito = async (req, res) => {
    try {
        const userId = req.user.sub;
        const params = req.body;
        const productos = {
            product: params.product,
            quantity: params.quantity
        }
        const msg = validateData(productos);
        
        if (!msg) {
            const searchProduct = await Product.findOne({_id: productos.product});
            const search = await Carrito.findOne({user: userId });
            if(searchProduct.stock > 0){
                if (search) {
                const update = await Carrito.findOneAndUpdate({ _id: search.id }, { $push: { products: [{ product: productos.product, quantity: productos.quantity }] } });
                return res.send({ message: 'Producto agregado', update })
                }else{
                    return res.send({message: 'Producto no agregado'});
                }
            }
        }else return res.send(msg)
    } catch (err) {
        console.log(err);
        return err;
    }
}