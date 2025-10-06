import express from "express";
import { userAuth } from "../middlewares/userAuth.js";
import { ConnectionRequest } from "../models/connectionRequest.js";
import { User } from "../models/user.js";
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

userRouter.get("/user/feed", userAuth, async(req,res)=>{
    try {
        const loggedInUser = req.user;
        const connections = await ConnectionRequest.find({
            $or: [
                {fromUserId: loggedInUser._id},
                {toUserId: loggedInUser._id}
            ]
        }).select("fromUserId toUserId");

        const hideUserFromFeed = new Set();
        connections.forEach((item)=>{
            hideUserFromFeed.add(item.fromUserId.toString());
            hideUserFromFeed.add(item.toUserId.toString());
        });

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page-1)*limit;

        const userToShow = await User.find({
            $and: [
                {_id: {$nin: Array.from(hideUserFromFeed)}},
                {_id: {$ne: loggedInUser._id}}]
            }
        )
        .select(SAFE_USER_DATA)
        .skip(skip)
        .limit(limit);

        res.json({message: userToShow});
    } catch (error) {
        res.status(404).send('Error: '+ error.message);
    }
    
})

