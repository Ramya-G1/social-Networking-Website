const express=require('express');
const app=express();
const PORT=process.env.PORT||5000;
const mongoose=require('mongoose');
const cors=require('cors');
const {MONGOURI}=require("./config/keys");
mongoose.connect(MONGOURI,{ useNewUrlParser: true,useUnifiedTopology: true })
mongoose.connection.on('connected',()=>{
    console.log("connected to mongodb");
})
mongoose.connection.on('error',()=>{
    console.log("connection has failed to  mongodb");
})

require('./models/user');
require('./models/post');
app.use(express.json());
app.use(require('./routes/auth'));
app.use(require('./routes/post'));
app.use(require('./routes/user'));
app.use(cors());
if(process.env.NODE_ENV=="production"){
    app.use(express.static('client/build'))
    const path = require('path')
    app.get("*",(req,res)=>{
        res.sendFile(path.resolve(__dirname,'client','build','index.html'))
    })
}
app.listen(PORT,function(){
    console.log("server started");
})