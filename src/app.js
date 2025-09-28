const express = require("express");
const app = express();
const PORT = 3000;
const connectDB = require("./config/db.js");
const User = require("./models/user.js");

require("dotenv").config();
app.use(express.json());
app.post("/signup", async(req,res)=>{
  const user = new User(req.body);

  try {
    await user.save();
    res.send("User added successfully");
  } catch (error) {
    res.status(500).send("Error saving the user: ", error.message)
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

