const {Router}=require("express");
const {User}=require("../model/user");
const jwt=require("jsonwebtoken");
const bcrypt =require("bcrypt");
const {BlacklistModel}=require("../model/blacklist");
require("dotenv").config();
const userRouter=Router();

userRouter.post("/singup",async(req,res)=>{
    try {
        const {email,password,name,role}=req.body;
        const isUserPresent=await User.findOne({email});
        if(isUserPresent) return res.send("User find");
        const hash=await bcrypt.hashSync(password,8);
        const newUser=new User({name,email,password:hash,role})
        await newUser.save();
        res.send("singup successful")
    } catch (error) {
        res.send(error.message)
    }
})

userRouter.post("/login",async(req,res)=>{
    try {
        const {email,password}=req.body;
        const isUserPresent=await User.findOne({email});
        if(!isUserPresent) return res.send("User not find");
        const isPasswordCorrect=await bcrypt.compareSync(password,isUserPresent.password);
        if(!isPasswordCorrect)return res.send("Invalid credentials");
        const token = await jwt.sign(
            { email,userId:isUserPresent._id,role:isUserPresent.role },process.env.JWT_ACCESS_SECRET,{expiresIn:"1m"}
            );
            const refreshToken = await jwt.sign(
                { email,userId:isUserPresent._id,role:isUserPresent.role },process.env.JWT_REFRESH_SECRET,{expiresIn:"5m"}
                );
                res.send({msg:"login succes",token,refreshToken})
    } catch (error) {
        res.send(error.message)
    }
})


userRouter.get("/getnewtoken",async(req,res)=>{

    const reftoken=req.headers.authorization.split(" ")[1];
     console.log(reftoken)
    if(!reftoken)return res.send({msg:"please login"});

    jwt.verify(reftoken,process.env.JWT_REFRESH_SECRET,(err,decoded)=>{
        if(err)return  res.send({msg:"please login"});
        else{
            const token= jwt.sign({userId:decoded._id,role:decoded.role},"token",{expiresIn:"1m"});
         res.send({msg:"Login successful",token})
        }
    })
});

userRouter.get('/logout', async (req, res) => {
    try {
      // Add token to blacklist collection
      const token = req.headers.authorization?.split(' ')[1];
      const blacklistedToken = new BlacklistModel({ token });
      await blacklistedToken.save();
  
      res.status(200).send('Logged out successfully');
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  });

  module.exports={userRouter}