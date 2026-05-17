const express = require("express");
const jwt = require("jsonwebtoken");
const { authMiddleware } = require("./middleware")
const { userModel, orgModel } = require("./model")




const BOARDS = [];

const ISSUES = [];

const app = express();
app.use(express.json());

// CREATE
app.post("/signup", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const userExists = await userModel.findOne({
        username: username
    })

    if (userExists) {
        res.status(411).json({
            message: "user is already registered"
        })
        return;
    }
    const newUser = await userModel.create({
        username: username,
        password: password
    })

    res.json({
        id: newUser._id,
        message: "user registered"
    })


})

app.post("/signin", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const userExists = await userModel.findOne({
        username: username,
        password: password
    })
    if (!userExists) {
        res.status(403).json({
            message: "Incorrect credentials"
        })
        return;
    }

    const token = jwt.sign({
        userId: userExists._id
    }, "attlasiationsupersecret123123password");
    // create a jwt for the user

    res.json({
        token
    })
})

// AUTHENTICATED ROUTE - MIDDLEWARE
app.post("/organization", authMiddleware, async (req, res) => {
    const userId = req.userId;
    const neworg = await orgModel.create({
        title: req.body.title,
        description: req.body.description,
        admin: userId,
        members: []
    })

    res.json({
        message: "Org created",
        id: neworg._id
    })
})

app.post("/add-member-to-organization", authMiddleware, async (req, res) => {
    const userId = req.userId;
    const organizationId = req.body.organizationId;
    const memberUsername = req.body.memberUsername;

    const orgExist = await orgModel.findOne({
        _id: organizationId
    })

    if (!orgExist || orgExist.admin.toString() !== userId) {
        res.status(411).json({
            message: "Either this org doesnt exist or you are not an admin of this org"
        })
        return
    }

    const memberUser = await userModel.findOne({
        username: memberUsername
    })


    if (!memberUser) {
        res.status(411).json({
            message: "No user with this username exists in our db"
        })
        return
    }
    orgExist.members.push(memberUser._id);
    await orgExist.save();
    res.json({
        message: "New member added!"
    })
})

app.post("/board", (req, res) => {

})

app.post("/issue", (req, res) => {

})

//GET endpoints
app.get("/organization", authMiddleware, async (req, res) => {
    const userId = req.userId;
    const organizationId = req.query.organizationId;

    const orgExist = await orgModel.findOne({
        _id: organizationId
    })

    if (!orgExist || orgExist.admin.toString() !== userId) {
        res.status(411).json({
            message: "Either this org doesnt exist or you are not an admin of this org"
        })
        return
    }
    const allMembers = await userModel.find({
        _id: orgExist.members
    })

    res.json({
        title: orgExist.title,
        description: orgExist.description,
        members: allMembers.map((member) => member.username)
    })



})

app.get("/boards", (req, res) => {


})

app.get("/issues", (req, res) => {

})

app.get("/members", (req, res) => {

})


// UPDATE
app.put("/issues", (req, res) => {

})

//DELETE -- FIND THE GBUG and fix it
app.delete("/members", authMiddleware, async (req, res) => {
    const userId = req.userId;
    const organizationId = req.body.organizationId;
    const memberUsername = req.body.memberUsername;

    const orgExist = await orgModel.findOne({
        _id: organizationId
    })

    if (!orgExist || orgExist.admin.toString !== userId) {
        res.status(411).json({
            message: "Either this org doesnt exist or you are not an admin of this org"
        })
        return
    }

    const memberUser = await userModel.findOne({
        username: memberUsername
    })


    if (!memberUser) {
        res.status(411).json({
            message: "No user with this username exists in our db"
        })
        return
    }
     orgExist.members = orgExist.members.filter((memberId) => memberId.toString() !== memberUser._id.toString());
     await orgExist.save();
    res.json({
        message: "member deleted!"
    })
})

app.listen(3000);