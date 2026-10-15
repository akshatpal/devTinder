const express = require('express');
const ConnectionRequest = require('../models/connectionRequest');
const User = require('../models/user');

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

userRouter.get('/user/feed', userAuth , async (req,res) => {
    try{
        const loggedInUser = req.user;

        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit > 100 ? 100:limit;
        const skip = (page - 1) * limit;
        
        const connectionRequest = await ConnectionRequest.find({
            $or: [
                {fromUserId: loggedInUser._id},
                {toUserId: loggedInUser._id}
            ]
        }).select("fromUserId toUserId");

        const hideUserFromFeed = new Set();

        connectionRequest.forEach(request => {
            hideUserFromFeed.add(request.fromUserId);
            hideUserFromFeed.add(request.toUserId);
        });

        const data = await User.find({
            $and: [
                { _id : { $nin : Array.from(hideUserFromFeed)}},
                { _id : {$ne : loggedInUser._id}}
            ]
        }).select("firstName lastName age").skip(skip).limit(limit);
        
        res.json({data});
        
    }
    catch(err){
        res.status(400).send("Error : " + err.message);
    }
})


module.exports = userRouter