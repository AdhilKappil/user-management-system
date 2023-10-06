const mongoose = require("mongoose");
const path = require("path")
mongoose.connect("mongodb://127.0.0.1:27017/user_management_system")




const express = require("express");
const app = express();

app.use("/static", express.static(path.join(__dirname, "public")));

const disable = (req, res, next) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '1');
    next();
}



//user Route
const userRoute = require('./routers/userRoute');
app.use('/',disable,userRoute);

//Admin Route
const adminRoute = require('./routers/adminRoute');
app.use('/admin',disable,adminRoute);

app.use('*',(req,res)=>{
    res.send('Go To Login page')
})

app.listen(3000,()=>{
    console.log("Server is running...");
})