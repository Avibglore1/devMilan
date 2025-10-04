import validator from "validator";

export const validateSignupData = (req,res) =>{
    const{firstName,lastName,emailId,password} = req.body;
    if(!firstName || !lastName) throw new Error("Name is not valid");
    else if(!validator.isEmail(emailId)) throw new Error("Email not valid");
    else if(!validator.isStrongPassword(password)) throw new Error("Password not strong");
}

export const validateEditProfileData = (req,res) =>{
    const allowedEditField = [
        'firstName','lastName','photoUrl','gender','age','about','skills'
    ];
    const isAllowed = Object.keys(req.body).every((key)=>allowedEditField.includes(key));
    return isAllowed
}