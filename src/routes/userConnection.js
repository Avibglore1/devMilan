import express from "express";
import { userAuth } from "../middlewares/userAuth.js";
import { ConnectionRequest } from "../models/connectionRequest.js";
export const userRouter = express.Router();

const SAFE_USER_DATA = "firstName lastName photoUrl age gender about skills";

userRouter.get("/user/request", userAuth, async(req,res)=>{
    try {
         const loggedInUser = req.user;

        const connectionRequest = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: 'interested'
        }).populate("fromUserId",SAFE_USER_DATA);
        if(!connectionRequest.length) {
            return res.status(404).json({message:"No Connection Request Found"});
        }
        

        res.status(200).json({message: connectionRequest});
    } catch (error) {
        res.status(500).send("Error: " + error.message);
    }
   
})

userRouter.get("/user/connections", userAuth, async(req,res)=>{
    try {
        const loggedInUser = req.user;

    const connections = await ConnectionRequest.find({
        $or:[
            {toUserId: loggedInUser._id, status: "accepted"},
            {fromUserId: loggedInUser._id, status: "accepted"}
        ]
    })
    .populate("fromUserId", SAFE_USER_DATA)
    .populate("toUserId", SAFE_USER_DATA)

    if(!connections.length) throw new Error("No connection found");

    const data = connections.map((key)=>{
        if(loggedInUser._id.toString()===key["fromUserId"]._id.toString()){
            return key["toUserId"];
        }else return key["fromUserId"]
    });

    return res.status(200).json({message: data});
    } catch (error) {
        res.status(404).send("message: " + error.message)
    }
    
})

