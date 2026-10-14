const express = require('express');
const {userAuth} = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');
const User = require('../models/user');

const requestRouter = express.Router();

requestRouter.post('/request/send/:status/:toUserId', userAuth , async (req, res)=>{
    try{
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        const allowedStatus = ["interested", "ignored"];
        if(!allowedStatus.includes(status)){
            return res.status(400).json({message: "Invalid status type"});
        }

        const existingConnectionrequest = await ConnectionRequest.findOne({
            $or:[
                {fromUserId,toUserId},
                {fromUserId: toUserId , toUserId: fromUserId}
            ]
        });

        if(existingConnectionrequest){
            throw new Error("Request already exists");
        }

        const toUser = await User.findById(toUserId);
        if(!toUser){
            throw new Error("User not found");
        }

        const request = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        })
        const data = await request.save();
        res.json({message: "Request sent successfully",data}); 
    }
    catch(err){
        res.status(400).send("Error : " + err.message);
    }
})

requestRouter.post('/request/review/:status/:requestId',userAuth, async (req,res) => {
    try{
        const loggedInUser = req.user;
        const {status,requestId} = req.params;
        //AKshat sent request to prinshu
        //prinshu should be the loggedIn user
        //status sould be iterested only.

        //Validate the status
        const allowedStatus = ['accepted','rejected'];
        if(!allowedStatus.includes(status)){
            throw new Error("Invalid status type");
        }
        //Validate the request
        const connectionRequest = await ConnectionRequest.findOne({
            _id : requestId,
            status: "interested",
            toUserId : loggedInUser._id
        })
        if(!connectionRequest){
            throw new Error("Invalid request");    
        }
        
        connectionRequest.status = status;
        const updatedRequest = await connectionRequest.save();
        res.json({
            message: "Request reviewed successfully",
            data: updatedRequest
        });
        
    }
    catch(err){
        res.status(400).send("Error : " + err.message);
    }
})

module.exports = requestRouter;