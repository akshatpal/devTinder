const express = require('express');
const {userAuth} = require('../middlewares/auth');

const requestRouter = express.Router();

requestRouter.post('/sendconnectionrequest', userAuth ,(req,res)=>{
    try{
        const user = req.user;

        res.send(user.firstName + ' sent you a connection request');
    }
    catch(err){
        res.status(400).send("Something went wrong");
    }
})

module.exports = requestRouter;