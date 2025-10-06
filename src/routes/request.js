import express from "express";
import { userAuth } from "../middlewares/userAuth.js";
import { ConnectionRequest } from "../models/connectionRequest.js";
import { User } from "../models/user.js";
export const requestRouter = express.Router();

requestRouter.post("/request/send/:status/:toUserId",userAuth, async(req,res)=>{
    try{
        const senderId = req.user._id;
        const receiverId = req.params.toUserId;
        const status = req.params.status;

        const toUser = await User.findById(receiverId);
        if(!toUser) throw new Error("Request Denied ❌")

        const allowedStatus = ["interested", "ignored"];
        if(!allowedStatus.includes(status)) throw new Error("Invalid status type");

        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or:[
                {fromUserId: senderId, toUserId: receiverId},
                {fromUserId: receiverId, toUserId: senderId}
            ]
        })

        if(existingConnectionRequest) return res.status(400).
        json({message: "Connection already sent/received"});

        const connectionRequest = new ConnectionRequest({
            fromUserId: senderId,
            toUserId: receiverId,
            status
        });

        const data = await connectionRequest.save();
        res.json({
            message: "Connection request sent successfully",
            data
        })
    }catch(err){
        res.status(400).send("Error: "+err.message)
    }
});

requestRouter.post("/request/review/:status/:requestId", userAuth, async(req,res)=>{
    try{
        const loggedInUser = req.user;
        const{status,requestId} = req.params;
        const allowedStatus = ["accepted","rejected"];
        if(!allowedStatus.includes(status)) {
            return res.status(404).json({message:"Status not allowed"});
        }

        const connectionRequest  = await ConnectionRequest.findOne({
            _id:requestId,
            toUserId:loggedInUser._id,
            status:"interested"
        });

        if(!connectionRequest){
            return res.status(404).json({message: "Connection request not found"});
        }
        connectionRequest.status = status;

        const data = await connectionRequest.save();

        return res.status(200).json({message: "connection request " + status,data})
    }catch(err){
        return res.status(500).send("Something went wrong");
    }
})