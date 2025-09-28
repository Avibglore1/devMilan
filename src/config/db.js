const mongoose = require("mongoose");

const connectDB = async() =>{
    await mongoose.connect(
        "mongodb+srv://Avinash:DJ0Sc8rtMM5AP8mA@backend.s3dfq.mongodb.net/devMilan"
    )
}

module.exports = connectDB;
