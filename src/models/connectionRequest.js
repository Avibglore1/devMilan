import mongoose  from "mongoose";

const connectionRequestSchema = new mongoose.Schema({
    fromUserId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    toUserId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    status:{
        type: String,
        enum:{
            values: ['ignored','interested','accepted','rejected'],
            message: `{values} is not supported status`
        }
    }
},{timestamps: true})

connectionRequestSchema.index({fromUserId: 1, toUserId: 1});

connectionRequestSchema.pre("save", function(next){
    if(this.fromUserId.equals(this.toUserId)) 
    throw new Error ("Cant send connection request/ignored to self");
    next()
})
export const ConnectionRequest = new mongoose.model("connectionRequest",connectionRequestSchema)