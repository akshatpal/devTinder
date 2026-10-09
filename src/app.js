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
