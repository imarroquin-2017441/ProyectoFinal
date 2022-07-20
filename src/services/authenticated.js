'use strict'

const jwt = require('jwt-simple');
const moment = require('moment');
const secretKey = 'Dato';

exports.ensureAuth = (req, res, next)=>{
    if(!req.headers.authorization){
        return res.status(403).send({message: 'La peticion no contiene la cabecera de autenticacion'});
    }else{
        try{
            let token = req.headers.authorization.replace(/['"]+/g, '');
            var payload = jwt.decode(token, secretKey);
            if(payload.exp <= moment().unix()){
                return res.status(403).send({message: 'Token expirado'})
            }
        }catch(err){
            console.log(err);
        return res.status(400).send({message: 'El Token no es valido'})
        }
        req.user = payload;
        next();
    }
}

exports.isAdmin = async (req, res, next)=>{
    try{
        const user = req.user;
        if(user.role === 'ADMIN') return next();
        return res.status(403).send({message: 'Usuario no autorizado'});
    }catch(err){
        console.log(err);
        return err;
    }
}