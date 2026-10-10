const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 4
    },
    lastName: {
        type: String,
    },
    emailId: {
        type: String,
        lowercase: true,
        required: true,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Invalid email address")
            }
        }
    },
    password: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        default: 18,
        min: 18
    },
    gender: {
        type: String,
        //validate function is used to validate a particular condition for that field, and this validate method is only be called when a new user is created.
        // but not work when we are trying to update an existing data
        validate(value) {
            if (!['male', 'female', 'others'].includes(value)) {
                throw new Error("Gender data is wrong")
            }
        }
    }
}, { timestamps: true })

const User = mongoose.model("user", userSchema);
module.exports = User;