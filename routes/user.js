const express= require('express');
const router= express.Router();
const expressJwt = require('express-jwt');
const {User}= require('../models/User');



const requireSignin = expressJwt({
    secret: "DEEPAKKUMRAWAT",
//    userProperty: 'auth'
});

//jwt- used to generate token and stores it in cookies
//expressJwt- Middleware that checks if user has token and sets req.user.

//This module lets you authenticate HTTP requests using JWT tokens in your Node.js applications.
//JWTs are typically used to protect API endpoints, and are often issued using OpenID Connect.



router.get('/all_users', requireSignin, async (req,res)=> {
    
    try{
        let users= await User.find();
        if(!users){
            return res.status(400).send("No users found");
        }
        res.send(users);
    }
    catch(err){
        console.log(err);
        res.status(500).send("Server error");
    }
 
})



router.get('/:id', requireSignin, async (req,res)=> {
    
    try{
        let user= await User.findById(req.params.id);
        if(!user){
            return res.status(404).send("user not found");
        }
        res.send(user);
    }
    catch(err){
        console.log(err);
        if(err.kind=="ObjectId"){
            return res.status(404).send("user not found");
        }
        res.status(500).send("Server error");
    }
 
})


router.put('/edit', requireSignin, async (req, res)=> {
    
    try{
        let user= await User.findByIdAndUpdate(req.user.id, {$set:req.body},{new:true});
        res.send(user);
    }
    catch(err){
        console.log(err);
        res.status(500).send("Server error");
    }
      
})





router.get('/',requireSignin, (req,res)=> {
    res.send(req.user);
})



module.exports= router;
