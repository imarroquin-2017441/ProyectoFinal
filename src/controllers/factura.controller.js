'use strict'

const Product = require('../models/product.model');
const Carrito = require('../models/carrito.model');

exports.prueba = (req, res)=>{
    return res.send({message: 'La funcion prueba esta ejecutandose'});
};

exports.saveBuy = async (req, res) => {
    try {
        const userId = req.user.sub;
        const carrito = await Carrito.findOne({ user: userId });

        if (carrito) {
            for (var i = 0; i < carrito.products.length; i++) {
                const productId = carrito.products[i].product;
                const quantity = carrito.products[i].quantity;

                const product = await Product.findOne({ _id: productId });
                const resta = product.stock - quantity;

                if (resta < 0) return res.send({ message: 'Sin stock' });
                const data1 = {
                    stock: resta
                }
                await Product.findOneAndUpdate({ _id: productId }, data1, { new: true })
            }
            return res.send({ message: 'Factura completada', carrito });
        }
    } catch (err) {
        console.log(err);
        return err;
    }
}
