const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req,res,next)=>{
    try{
        //read the token from req.cookies
        const {token} = req.cookies;
        if(!token){
            throw new Error("Token is not valid");
        }

        //Validate the token
        const decodedData = jwt.verify(token, "akshatpal1722");
        const { _id } = decodedData;

        //Find the user
        const user = await User.findById(_id);
        if(!user){
            throw new Error("Invalid token");
        }
        req.user = user;
        next();
    }
    catch(err){
        res.status(401).send("Invalid token");
    }
};



module.exports = {userAuth};