const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema({
    fromUserId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:"user"
    },
    toUserId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:"user"
    },
    status:{
        type: String,
        required: true,
        enum: {
            values: ["ignored" , "interested" , "accepted" , "rejected"],
            message: "{VALUE} is incorrect status type"
        }
    }
},{timestamps:true});

connectionRequestSchema.index({fromUserId:1 , toUserId:1});

connectionRequestSchema.pre('save', function (){
    const connectionRequest = this;

    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("User cannot send request to himself !!");
    }
});

const connectionRequestModel = new mongoose.model('connectionRequest' , connectionRequestSchema);

module.exports = connectionRequestModel;