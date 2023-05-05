const jwt=require("jsonwebtoken");
const {BlacklistModel}=require("../model/blacklist");

require("dotenv").config()
const authenticator=async(req,res,next)=>{
    try {
        const token=req.headers.authorization.split(" ")[1];
        console.log(token)
        if(!token){
            return res.status(401).send({msg:"Please login again"})
        };
        // const blacklisteddata=JSON.parse(
        //     fs.readFile("./blacklist","utf-8"))
        // const isTokenBlacklist=blacklistData.find(
        //     (b_token)=>b_token==token
        // );


 // Checking for blacklisted token
 const isBlacklisted = await BlacklistModel.findOne({ token });
 console.log(isBlacklisted)
 if (isBlacklisted) {
   return res.status(401).send('Token is blacklisted');
 }

        const isTokenValid=await jwt.verify(token,process.env.JWT_ACCESS_SECRET);
        if(!isTokenValid)return res.status(403).send({msg:"Autheticatin failed"});
        req.body.userId=isTokenValid.userId;
        req.body.email=isTokenValid.email;
        req.body.role=isTokenValid.role;
        next();

    } catch (error) {
        res.send({msg:"Please login",err:error.message})
    }
};

module.exports={authenticator};