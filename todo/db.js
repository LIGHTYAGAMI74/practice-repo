const mongoose = require('mongoose')

async function connectDB(){
    await mongoose.connect("mongodb+srv://localhost:27017/mernstack?retryWrites=true&w=majority").then((()=>{
        console.log("Database connected successfully")
    })).catch((err)=>{
        console.error("Error connecting to database:", err)
    })
}
module.exports ={
    connectDB
}