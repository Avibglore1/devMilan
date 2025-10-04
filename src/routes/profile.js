import express from "express";
export const profileRouter = express.Router();
import { userAuth } from "../middlewares/userAuth.js";
import { validateEditProfileData } from "../utils/validation.js";

profileRouter.get("/profile/view", userAuth, async(req,res)=>{
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
  res.status(500).send("Error: " +error.message)
  }
})

profileRouter.patch("/profile/edit", userAuth, async(req,res)=>{
    try {
       if(!validateEditProfileData(req)) throw new Error ("Invalid data to be updated");
       const loggedInUser = req.user;
       Object.keys(req.body).forEach((key)=>loggedInUser[key] = req.body[key]);
       await loggedInUser.save();
       res.json({message: "profile Data updated successfully 👍👍🎉",data:loggedInUser});
    } catch (error) {
        res.status(500).send('Error ' + error.message);
    }
    
})