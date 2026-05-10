const express = require('express')
const app = express()
const db = require('./config/db');
//const passport = require('./auth');
require('dotenv').config();


// const bodyParser = require('body-parser');
// app.use(bodyParser.json());

app.use(express.json());

app.get('/', (req,res) =>{
    res.send("welcome to the voting application dear users and candidates");
})


const userRoutes = require('./routes/userRoutes');
const candidateRoutes = require('./routes/candidateRoutes');

app.use('/user', userRoutes);
app.use('/candidate', candidateRoutes);

app.listen(3000, () =>{
    console.log("the localhost is running please check postman for verification");
})