import jwt from "jsonwebtoken";
import { User } from "../models/user.js";

export const userAuth = async(req,res,next) =>{
    try {
        const token = req.cookies.jwt;
        if(!token) throw new Error("Token not valid");
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);

        const user = await User.findById(decodedToken);
        if(!user) throw new Error("User not found");

        req.user = user;
        next();
    } catch (error) {
        res.status(400).send("Error: " + error.message);
    }
}