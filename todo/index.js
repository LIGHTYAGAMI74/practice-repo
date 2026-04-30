// const express = require("express")
// const middleware = require("./middleware").authenticateToken
// const {userModel,todoModel} = require("./model")
// const connectDB = require("./db").connectDB
// connectDB()
// const jwt = require("jsonwebtoken")

// const app = express()
// app.use(express.json())


// let USER =[]
// let TODO = []
// // end point
// app.post("/signup",async function(req,res){
//     const username = req.body.username;
//     const password = req.body.password;

// const UserExist = awaituserModel.findOne({
//     username:username,
//     password:password
// })
//     // 
//     if(!UserExist){
//         const newUser = await userModel.create({
//             username:username,
//             password:password
//         })
//         res.status(201).json({
//             userID: newUser._id
//         })  
        
//     }
//     else{
//         res.status(401).json({
//             error:"user is already exist"
//         })
//     }
// })
// app.post("signin",async function(req,res){
//     const username = req.body.username
//     const password = req.body.password;
//     // const UserExist = USER.find(u=> u.username === username && u.password === password)
//     const UserExist = await userModel.findOne({
//         username:username,
//         password:password
//     })
//     if(!UserExist){
//         res.status(401).json({
//             error:"Invalid username or password"
//         })
//     }
  
//     const token = jwt.sign({userId:userId},"secret")
//     res.json({token})
// })
// app.post("/todo",middleware,function(req,res){
//     const userId = req.userId;
//     const title = req.body.title;
//     const description = req.body.description;
//     TODO.push({
//         todoId:todo_count++,
//         userId:userId,
//         title:title,
//         description:description
//     })
//     res.status(201).json({
//         message:"Todo created successfully",
//         todoId:todo_count-1
//     })

// })

// app.delete("/todo/:id",middleware,function(req,res){
//     const userId = req.userId;
//     const todoId = parseInt(req.params.id);
//     const TodoExist = TODO.find(t=> t.todoId == todoId && t.userId === userId)
//     if(!TodoExist){
//         res.status(411).json({
//             message:"todo is not found or it is not your todo"
//         })
//     }
//     else{
//         TODO = TODO.filter(t=> t.todoId != todoId)
//         res.json({
//             message:"todo deleted successfully"
//         })
//     }
    
// })

// app.get("/todo",middleware,function(req,res){
//     const userId = req.userId;
//     const userTodos = TODO.filter(t=> t.userId === userId)
//     res.json(userTodos)
// })


// app.listen(3000)


const express = require("express")
const app = express()
const {userModel , todoModel} = require("./model")
const connectDB = require("./db").connectDB()
const jwt = require("jsonwebtoken")
const skipMiddlewareFunction = require("./middleware").authenticateToken

app.use(express.json())


//end point 
app.post("/signup", function (req,res){
    const username  = req.body.username
    const password = req.body.password
    
    const UserExist = userModel.findOne({
        username,
        password
    })

    if(!UserExist){
        const newUser = userModel.create({
            username,
            password
        })
        res.status(201).json({
            userId:newUser._id
        })
    }
    else{
        res.status(401).json({
            error:"user is already exist"
        })
    }



})
app.post("/signin",async (req,res)=>{
    const username = req.body.username
    const password = req.body.password


    const UserExist = await userModel.findOne({
        username,
        password
    })
    if(!UserExist){
        res.status(401).json({
            message:" user is not registered"
        })
    }
    const token = jwt.sign({userId:UserExist._id},"secret")
    res.json({
        token:token
    })
})

app.post("/todo",skipMiddlewareFunction,async (req,res)=>{
    const userId = req.userId
    const title = req.body.title
    const description = req.body.description

    const res = await todoModel.create({
        title,
        description,
        userId
    })
    res.status(201).json({
        message:"Todo created successfully",
        todoId:res._id
    })
})

app.delete("todo/:id",skipMiddlewareFunction,(req,res)=>{
    const userId = req.userId
    const todoId = req.params.id

    const TodoExist = todoModel.findOne({
        _id:todoId,
        userId:userId
    })
    if(!TodoExist){
        res.status(401).json({
            message:"todo is not found or it is not your todo"
        })
    }
    else{
        todoModel.deleteOne({
            _id:todoId
        })
        res.json({
            message:"todo deleted successfully"
        })
    }
})


app.get("/todo",skipMiddlewareFunction,async (req,res)=>{
    const userId = req.userId
    const findTodo = await todoModel.find({
        userId:userId
    })
    res.json({findTodo})

})

app.listen(3000)