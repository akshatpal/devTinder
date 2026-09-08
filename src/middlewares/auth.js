const adminAuth = (req,res,next)=>{
    const token = "xyz64";
    const isAuthorized = token ==="xyz";

    if(!isAuthorized){
        return res.status(401).send("Unauthorized admin");
    }else{
        next();
    }
};



module.exports = {adminAuth};