const express = require('express');
const connectDB = require("./config/database");
const app = express();
const {adminAuth} = require('./middlewares/auth');
const User = require("./models/user");

// this middleware is used to convert the data or request in json format.
app.use(express.json());

app.post('/signup', async (req,res) => {
    const newUser = new User(req.body)
    await newUser.save();
    res.status(201).send("User created successfully");
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

app.patch('/user', async (req,res) => {
    try{
        const userId = req.body.userId;
        const data = req.body;
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
