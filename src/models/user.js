const mongose = require("mongoose");

const userSchema = new mongose.Schema({
    firstName:{
        type: String,
    },
    lastName:{
        type: String,
    },
    emailId:{
        type: String,
    },
    password:{
        type: String,
    },
    age:{
        type: Number,
    },
    gender:{
        type: String,
    }
})

const User = mongose.model("user",userSchema);
module.exports = User;