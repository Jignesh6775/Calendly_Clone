const app=require("express")();


app.get("/",(req,res)=>{
    res.sendFile(__dirname+'/index.html');
})

app.listen(8090,()=>{
    console.log("connetcted to server")
})