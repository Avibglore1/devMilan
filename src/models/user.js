import mongoose  from "mongoose";
import validator from "validator";
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 4,
        maxLength: 40
    },
    lastName:{
        type: String
    },
    emailId:{
        type: String,
        required: true,
        unique:true,
        lowercase: true,
        trim: true,
        validate(val){
            if(!validator.isEmail(val)){
                throw new Error("Invalid Email Address " + val);
            }
        }
    },
    password:{
        type: String,
        required: true
    },
    photoUrl:{
        type: String,
        default:"https://www.vhv.rs/dpng/d/15-155087_dummy-image-of-user-hd-png-download.png"
    },
    age: {
        type: Number,
        min: 18
    },
    gender:{
        type: String,
        enum: ['male','female','others'],
        message: 'gender must be male,female or others'
    }
},{timestamps: true});

export const User = mongoose.model("User",userSchema);

