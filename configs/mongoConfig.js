'use Strict'

const mongoose = require('mongoose');

exports.init = ()=>{
    const uriMongo = 'mongodb://127.0.0.1:27017/ventaOnline';
    mongoose.Promise = global.Promise;
    mongoose.connection.on('error', ()=>{
        console.log('MongoDB | No se pudo conectar a mongodb ');
    });
    mongoose.connection.on('connecting', ()=>{
        console.log('MonogoDB | Intentando conectar');
    });
    mongoose.connection.on('connected', ()=>{
        console.log('MongoDB | Conectado');
    });
    mongoose.connection.once('open', ()=>{
        console.log('MongoDB | Conectado a DB');
    });
    mongoose.connection.on('reconnected', ()=>{
        console.log('MongoDB | Reconectando a DB');
    });
    mongoose.connection.on('disconnected', ()=>{
        console.log('MongoDB | Error, mongodb esta desconectado');
    });

    mongoose.connect(uriMongo, {
        maxPoolSize: 15,
        wtimeoutMS: 2500,
        useNewUrlParser: true
    }).catch(err=>console.log(err));
}