import express from "express";
export const authRouter = express.Router();
import { validateSignupData } from "../utils/validation.js";
import bcrypt from "bcrypt";
import { User } from "../models/user.js";

authRouter.post("/signup", async(req,res)=>{
  try {
    validateSignupData(req);
    const {firstName,lastName,emailId,password}  =req.body;
    const hashPassword = await  bcrypt.hash(password,10);
    const user = new User({
      firstName,lastName,emailId,password:hashPassword
    });
    await user.save();
    res.send("User added successfully");
  } catch (error) {
    res.status(500).send("Error saving the user: " + error.message)
  }
})

authRouter.post("/login", async(req,res)=>{
  try {
    const {emailId,password} = req.body;
    
    
    if(!emailId || !password) throw new Error("EmailId or Password required");

    const user = await User.findOne({emailId:emailId});
    if(!user) throw new Error ("Invalid Credential");

    const isPasswordValid = await bcrypt.compare(password,user.password);
    if(!isPasswordValid) throw new Error("Invalid Credential");

    const token = await user.getJWT();

    res.cookie("jwt",token)
    res.send(user);
  } catch (error) {
  res.status(500).send("Error: " + error.message)
  }
})

authRouter.post("/logout", (req,res)=>{
    res.cookie("jwt",null,{expires:new Date(Date.now())});
    res.send("Loggedout Successfully");
})
