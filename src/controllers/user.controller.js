'use strict'

const User = require('../models/user.model');
const Carrito = require('../models/carrito.model');
const { validateData, alreadyUser, encrypt
        , checkPassword, checkPermission, checkUpdate } = require('../utils/validate');
const jwt = require('../services/jwt');

exports.prueba = (req, res)=>{
    return res.send({message: 'La funcion prueba esta ejecutandose'});
};

exports.register = async (req, res)=>{
    try{
        const params = req.body;
        const data = {
            name: params.name,
            username: params.username,
            password: params.password,
            role: 'CLIENT'
        }
        
        const msg = validateData(data);
        
        if(!msg){
            let userExist = await alreadyUser(params.username);
            if(!userExist){
                data.email = params.email;
                data.phone = params.phone;
                data.password = await encrypt(params.password);

                let user = new User(data);
                await user.save();
                const users = await User.findOne({username: params.username});
                console.log({users})
                const data1 = {
                    user: users.id
                }
                let carrito = new Carrito(data1);
                await carrito.save();
                return res.send({message: 'El usuario se guardo exitosamente'});
            }else{
                return res.send({message: 'El nombre de usuario ya esta en uso, escoge otro'});
            }
        }else {
            return res.status(400).send(msg);
        }
    }catch(err){
        console.log(err);
        return err;
    }
}

exports.registerAdmin = async (req, res)=>{
    try{
        const params = req.body;
        const data = {
            name: params.name,
            username: params.username,
            password: params.password,
            role: params.role
        } 
        const msg = validateData(data);
        
        if(!msg){
            let userExist = await alreadyUser(params.username);
            if(!userExist){
                data.email = params.email;
                data.phone = params.phone;
                data.password = await encrypt(params.password);

                let user = new User(data);
                await user.save();
                return res.send({message: 'El usuario se guardo exitosamente'});
            }else{
                return res.send({message: 'El nombre de usuario ya esta en uso, escoge otro'});
            }
        }else {
            return res.status(400).send(msg);
        }
    
    }catch(err){
        console.log(err);
        return err;
    }
}

exports.login = async (req, res)=>{
    try{
        const params = req.body;
        const data = {
            username: params.username,
            password: params.password
        }

        let msg = validateData(data);

        if(!msg){
            let userExist = await alreadyUser(params.username);
            if(userExist && await checkPassword(params.password, userExist.password)){
                const token = await jwt.createToken(userExist);
                const search = await User.findOne({username: data.username});
                const carrito = await Carrito.findOne({user: search.id});
                return res.send({token, message: 'Logueado de manera correcta', carrito});
            }else{
                return res.send({message: 'Username o password incorrectos'});
            }
        }else{
            return res.status(400).send(msg);
        }
    }catch(err){
        console.log(err);
        return err;
    }
}

exports.update = async (req, res)=>{
    try{
        const userId = req.params.id;
        const params = req.body;
        const permission = await checkPermission(userId, req.user.sub);
        if(permission === false){
            return res.status(403).send({message: 'Accion no autorizada'});
        }else{
            const notUpdated = await checkUpdate(params);
            if(notUpdated === false){
                return res.status(400).send({message: 'Estos parámetros solo son actualizables por Admins'});
            }else{
                const already = await alreadyUser(params.username);
                if(!already){
                    const userUpdated = await User.findOneAndUpdate({_id: userId}, params, {new: true})
                    .lean();
                    return res.send({userUpdated, message: 'Usuario actualizado'});
                }else{
                    return res.send({message: 'Username ya utilizado'});
                }
            }
        }
    }catch(err){
        console.log(err);
        return err;
    }
}

exports.delete = async (req, res)=>{
    try{
        const userId = req.params.id;
        const permission = await checkPermission(userId, req.user.sub);
        if(userId == req.user.sub){
            if(permission === false){
                return res.send(403).send({message: 'Accion inautorizada'})
            }else{
                const userDelete = await User.findOneAndDelete({_id: userId});
                if(userDelete){
                return res.send({userDelete, message: 'Cuenta eliminada'});
                }else{
                    return res.send({message: 'Usuario no encontrado o ya eliminado'})
                }
            }
        }
    }catch(err){
        console.log(err);
        return err;
    }
}