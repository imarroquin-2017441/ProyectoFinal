'use strict'

const mongoCofig = require ('./configs/mongoConfig');
const app = require ('./configs/app');
const port = 4000;

mongoCofig.init();
app.listen(port, ()=>{
    console.log(`Servidor http corriendo en el puerto ${port}`);
})