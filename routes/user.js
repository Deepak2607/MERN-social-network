const express= require('express');
const router= express.Router();
const expressJwt = require('express-jwt');
const {User}= require('../models/User');



//function to check authentication
//checking if current token in cookies contain this secret or not
//no token -> no secret -> no authentication
//the same secret is used to generate token 
const requireSignin = expressJwt({
    secret: "DEEPAKKUMRAWAT",
//    userProperty: 'auth'
});

//jwt- used to generate token and stores it in cookies
//expressJwt- Middleware that checks if user has token and sets req.user.

//This module lets you authenticate HTTP requests using JWT tokens in your Node.js applications.
//JWTs are typically used to protect API endpoints, and are often issued using OpenID Connect.





//getting signed in user details
//req.user conntain those fields which are used in generating the token during signin
//I used _id and name to generate token, so req.user contain _id and name fields only 
router.get('/',requireSignin, (req,res)=> {
    res.send(req.user);
})




//get all users
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



//get a user by id
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



//edit my user profile (my profile..obviously)
//can't update another user's
router.put('/edit', requireSignin, async (req, res)=> {
    
    try{
        let user= await User.findByIdAndUpdate(req.user._id, {$set:req.body},{new:true});
        res.send(user);
    }
    catch(err){
        console.log(err);
        res.status(500).send("Server error");
    }
      
})



//delete my profile
router.delete('/delete', requireSignin, async (req, res)=> {
     
    try{
        let user= await User.findByIdAndRemove(req.user._id);     
        res.send(`yours (${user.name}'s) account is deleted`);
   
    }
    catch(err){
        console.log(err);
        res.status(500).send("Server error");
    }

})




module.exports= router;
