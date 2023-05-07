const mongoose=require("mongoose");

const UserSchema=mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true},
    password:{type:String,required:true},
    role:{type:String,enum:["User","Admin"],default:"User"}
})
const User=mongoose.model("user",UserSchema);

module.exports={User}