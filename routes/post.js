const express= require('express');
const router= express.Router();
const expressJwt = require('express-jwt');
const {Post}= require('../models/Post');



const requireSignin = expressJwt({
    secret: "DEEPAKKUMRAWAT",
//    userProperty: 'auth'
});

//jwt- used to generate token and stores it in cookies
//expressJwt- Middleware that checks if user has token and sets req.user.

//This module lets you authenticate HTTP requests using JWT tokens in your Node.js applications.
//JWTs are typically used to protect API endpoints, and are often issued using OpenID Connect.




//writing a post
router.post('/',requireSignin, async (req,res)=> {
    
//    console.log(req.body);
    let errors=[];
    
    if(!req.body.title){
        errors.push({message:'Enter title'});
    } 
    if(!req.body.body){
        errors.push({message:'Enter body'});
    }
    if(req.body.title.length<4){
        errors.push({message:'Title length must be greater than 3'});
    }
    if(req.body.body.length<4){
        errors.push({message:'Body length must be greater than 3'});
    }
     
    
    if(errors.length>0){
        return res.status(400).send(errors);
    }
         
    try{
        const post= new Post(req.body);
        await post.save();
        res.send(post);   
    }
    catch(err){
        console.log(err);
        res.status(500).send('Server error');
    }
 
})



//get all posts
router.get('/all_posts', requireSignin, async (req,res)=> {
    
    try{
        let posts= await Post.find();
        if(!posts){
            res.status(400).send("No posts found");
        }
        res.send(posts);
    } 
    catch(err){
        console.log(err);
        res.status(500).send('Server error');
    }
})





module.exports= router;