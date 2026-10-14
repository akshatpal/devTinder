const express = require('express');
const ConnectionRequest = require('../models/connectionRequest');

const userRouter = express.Router();
const { userAuth } = require('../middlewares/auth');

//this is the api to get pending requests of the curret loggedIn user
userRouter.get('/user/requests/recieved', userAuth , async (req,res) => {
    try{
        const loggedInUser = req.user;
        const requests = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested"
        }).populate("fromUserId",["firstName", "lastName", "age"]);

        res.json({
            message: "Requests fetched successfully",
            requests
        });
    }
    catch(err){
        res.status(400).send("Error : " + err.message);
    }
})

userRouter.get('/user/connections', userAuth , async (req,res) => {
    try{
       const loggedInUser = req.user;

       const myRequests = await ConnectionRequest.find({
        $or:[
            {toUserId: loggedInUser._id, status: "accepted"},
            {fromUserId: loggedInUser._id, status: "accepted"}
        ]
       }).populate("fromUserId",["firstName", "lastName", "age"]).populate("toUserId",["firstName", "lastName", "age"]);

       const data = myRequests.map(request => {
        if(request.fromUserId._id.equals(loggedInUser._id)){
            return request.toUserId;
        }
        else{
            return request.fromUserId;
        }
       });

       res.json({
            data
       })
    }
    catch(err){
        res.status(400).send("Error : " + err.message);
    }
})


module.exports = userRouter