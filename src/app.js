import express from "express"
const app = express();
const PORT = 3000;
import {connectDB} from "./config/db.js";
import {User} from "./models/user.js";
import dotenv from "dotenv";
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
  const user = new User(req.body);

  try {
    await user.save();
    res.send("User added successfully");
  } catch (error) {
    res.status(500).send("Error saving the user: " + error.message)
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

