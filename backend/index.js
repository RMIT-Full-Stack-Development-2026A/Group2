const express = require("express");
const mongoose = require("mongoose");
const app = express()


mongoose.connect("mongodb+srv://tictactoang_user:1111@fullstack.clq3ol0.mongodb.net/Node-API??appName=Fullstack")
.then(() =>{
    console.log("Connected to DB")
})
.catch(() =>{
    console.log("DB Connection Failed")
})

