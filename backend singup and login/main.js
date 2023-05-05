const express=require("express");
const { connection } = require("./config/db");
const {userRouter}=require("./routes/user");

 const {authenticator}=require("./middleware/authentication")




require("dotenv").config();

const port=process.env.PORT||8000;

const app=express();
app.use(express.json());


app.use("/user",userRouter)
app.use(authenticator);
app.get("/get",(req,res)=>{
    res.send("done")
})












app.listen(port,async()=>{
    try {
        await connection
        console.log("Connection to db and listening on port "+port)
    } catch (error) {
        console.log(error.message)
        console.log("Unable to connect to db")
    }
})