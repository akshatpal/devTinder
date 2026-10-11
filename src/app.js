const express = require('express');
const connectDB = require("./config/database");
const app = express();
const cookieParser = require('cookie-parser');

// this middleware is used to convert the data or request in json format.
app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");

app.use("/", authRouter)
app.use("/", profileRouter)
app.use("/", requestRouter)

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
