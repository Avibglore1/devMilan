import express from "express"
const app = express();

import {connectDB} from "./config/db.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { authRouter } from "./routes/auth.js";
import { profileRouter } from "./routes/profile.js";

dotenv.config();

app.use(express.json());
app.use(cookieParser());

app.use("/",authRouter);
app.use("/",profileRouter);

const PORT = 3000;
connectDB().then(()=>{
    console.log("Db connection established");
    app.listen(PORT,()=>{
    console.log(`Server listening on port ${PORT}`);    
})
}).catch(err=>{
    console.error("Error: " + err.message);    
})

