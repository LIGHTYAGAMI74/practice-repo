const mongoose  = require('mongoose')
mongoose.connect("mongodb://localhost:27017/trello")

const userSchema = mongoose.Schema({
    username:String,
    password:String
})

const orgSchema = mongoose.Schema({
    title:String,
    description:String,
    admin:mongoose.Types.ObjectId,
    members:[mongoose.Types.ObjectId]
})

const userModel = mongoose.model('User', userSchema)
const orgModel = mongoose.model('Organization', orgSchema)

module.exports={
    userModel,
    orgModel
}