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

        const connectionRequest = new ConnectionRequest({
            fromUserId: senderId,
            toUserId: receiverId,
            status
        });

        const toUser = await User.findById(receiverId);
        if(!toUser) throw new Error("Request Denied ❌")

        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or:[
                {fromUserId: senderId, toUserId: receiverId},
                {fromUserId: receiverId, toUserId: senderId}
            ]
        })

        if(existingConnectionRequest) return res.status(400).
        json({message: "Connection already sent/received"})

        const data = await connectionRequest.save();
        res.json({
            message: "Connection request sent successfully",
            data
        })
    }catch(err){
        res.status(400).send("Error: "+err.message)
    }
})