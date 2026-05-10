const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/votingApp');

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