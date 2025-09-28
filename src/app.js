const express = require("express");
const app = express();
const PORT = 3000;

app.use("/test",(req,res)=>{
    res.send("Hello from the server"); //request Handler
})

app.listen(PORT,()=>{
    console.log(`Server listening on port ${PORT}`);    
})