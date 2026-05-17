const mongoose = require('mongoose')
require('dotenv').config()

//const mongoUrl = process.env.MONGODB_URL_LOCAL;
const mongoUrl=process.env.MONGODB_URL
mongoose.connect(mongoUrl);

const db = mongoose.connection;

db.on('connected', () =>{
    console.log("mongodb connected");
})

db.on('error',(err) =>{
    console.error("error in connecting mongodb");
})

db.on('disconnected',() =>{
    console.log("mongodb disconnected");
})

module.exports = db;