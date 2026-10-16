const express = require("express");
const {validateSignUpData} = require('../utils/validation');
const User = require("../models/user");
const bcrypt = require('bcrypt');

const authRouter = express.Router();

authRouter.post('/signup', async (req,res) => {
    try{
        //validation of data
        validateSignUpData(req);

        //encrypting the password
        const {firstName , lastName , emailId , password} = req.body;

        const passwordHash = await bcrypt.hash(password, 10);
        const newUser = new User({
            firstName,
            lastName,
            emailId,
            password: passwordHash
        })
        await newUser.save();
        res.status(201).send("User created successfully");
    }
    catch(err){
        res.status(401).send("Validation failed "+ err.message);
    }
})


authRouter.post('/login', async (req,res) => {
    try{
        const {emailId , password} = req.body;

        const user = await User.findOne({emailId: emailId});
        if(!user){
            throw new Error("User not found");
        }
        const isCorrectPassword = await user.validatePassword(password);
        if(!isCorrectPassword){
            throw new Error("Password is incorrect !!");
        }else{
            const token = await user.getJWT();
            res.cookie('token',token , {expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)});
            res.send(user);
        }
    }
    catch(err){
        res.status(401).send("Validation failed "+ err.message);
    }
})


authRouter.post('/logout', async (req,res)=>{
    res.cookie("token", null , {expires: new Date(Date.now())});
    res.send("Logout Successfull.");
})

module.exports = authRouter;