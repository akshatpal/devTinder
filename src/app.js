const express = require('express');
const connectDB = require("./config/database");
const app = express();
const {adminAuth} = require('./middlewares/auth');
const User = require("./models/user");
const {validateSignUpData} = require('./utils/vaidation');
const bcrypt = require('bcrypt');

// this middleware is used to convert the data or request in json format.
app.use(express.json());

app.post('/signup', async (req,res) => {
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

app.post('/login', async (req,res) => {
    try{
        const {emailId , password} = req.body;

        const user = await User.findOne({emailId: emailId});
        if(!user){
            throw new Error("User not found");
        }
        const isCorrectPassword = await bcrypt.compare(password,user.password);
        if(!isCorrectPassword){
            throw new Error("Password is incorrect !!");
        }else{
            res.send("Login Successfull.");
        }
    }
    catch(err){
        res.status(401).send("Validation failed "+ err.message);
    }
})

app.get('/user', async (req , res) => {
    try{
        const userEmail = req.body.emailId;
        const user = await User.find({ emailId : userEmail })
        res.send(user);
    }
    catch (err){
        res.status(400).send("Something went wrong")
    }
})

app.delete('/user', async (req,res) => {
    try{
        const userId = req.body.userId;
        await User.findByIdAndDelete(userId);
        res.send("User deleted successfully");
    }
    catch(err){
        res.status(400).send("Something went wrong");
    }
})

app.patch('/user/:userId', async (req,res) => {
    try{
        const userId = req.params?.userId;
        const data = req.body;

        const ALLOWED_UPDATES = ['gender','age'];
        const isUpdateAllowed = Object.keys(data).every(k => ALLOWED_UPDATES.includes(k));
        if(!isUpdateAllowed){
            throw new Error("update not allowed")
        }
        await User.findByIdAndUpdate(userId, data);
        res.send("User Updated successfully");
    }
    catch(err){
        res.status(400).send("Something went wrong");
    }
})

app.get('/feed' , async (req,res) => {
    try{
        // find method is used to search data from the database based on the condition which we pass inside the object , empty object means give all the data which is present inside user collection.
        const users = await User.find({});
        res.send(users);
    }
    catch (err){
        res.status(400).send("Something went wrong")
    }
});

connectDB()
.then(()=> {
    console.log("Database connected successfully");
    app.listen(3000,()=>{
        console.log('Server running on port 3000');
    });
})
.catch((error)=> {
    console.log("Database connection failed", error);
});
