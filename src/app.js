const express = require('express');
const connectDB = require("./config/database");
const app = express();
const {adminAuth} = require('./middlewares/auth');
const User = require("./models/user");

app.post('/signup', async (req,res) => {
    const newUser = new User({
        firstName: 'Akshat',
        lastName: 'Pal',
        emailId: 'uyguyg@kshdids.com'
    })
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
