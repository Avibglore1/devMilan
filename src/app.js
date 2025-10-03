import express from "express"
const app = express();
const PORT = 3000;
import {connectDB} from "./config/db.js";
import {User} from "./models/user.js";
import dotenv from "dotenv";
import { validateSignupData } from "./utils/validation.js";
import bcrypt from "bcrypt";

dotenv.config();

app.use(express.json());

// app.patch('/updateUser', async(req,res)=>{
//   try {
//     const userId = req.body.userId;

//     const data = req.body;
//     await User.findByIdAndUpdate(userId,data);
//     res.send("user data updated successfully");
//   } catch (error) {
//     res.status(500).send("Spmething went wrong")
//   }
// }
// )
// app.delete("/deleteUser", async(req,res)=>{
//   try {
//     const userId = req.body.userId;
//     await User.findByIdAndDelete(userId);
//     res.send("User deleted successfully");
//   } catch (error) {
//     res.status(500).send("Something went wrong")
//   }
// })
// app.get("/feed", async(req,res)=>{
//   try{
//     const users = await User.find({});
//     if(!users.length) res.status(404).send("Database is empty");
//     res.send(users);
//   }catch{
//     res.status(500).send("Something went wrong");
//   }
// })

// app.get('/getUser', async(req,res)=>{
//   try {
//     const user = await User.find({emailId: req.body.emailId});
//     if(!user.length) res.status(404).send("User not found");
//     res.send(user)
//   } catch (error) {
//     res.status(500).send("Something went wrong")
//   }
// })

app.post("/signup", async(req,res)=>{

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

app.post("/login", async(req,res)=>{
  try {
    const {emailId,password} = req.body;
    if(!emailId || !password) throw new Error("EmailId or Password required");

    const user = await User.findOne({emailId:emailId});
    if(!user) throw new Error ("Invalid Credential");

    const isPasswordValid = await bcrypt.compare(password,user.password);
    if(!isPasswordValid) throw new Error("Invalid Credential");

    res.send('Login Successfull');

  } catch (error) {
    res.status(500).send("Error: " + error.message);
  }
})
connectDB().then(()=>{
    console.log("Db connection established");
    app.listen(PORT,()=>{
    console.log(`Server listening on port ${PORT}`);    
})
}).catch(err=>{
    console.error("Database cannot be connected");    
})

