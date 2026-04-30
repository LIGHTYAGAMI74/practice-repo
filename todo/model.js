const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username:String,
    password:String
})

const todoSchema = new mongoose.Schema({
    title:String,
    description:String,
    userId:mongoose.Types.ObjectId,
})

const userModel = mongoose.model("User",userSchema)
const todoModel = mongoose.model("Todo",todoSchema)

module.exports = {
    userModel,
    todoModel
}