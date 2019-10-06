const express= require('express');
const router= express.Router();
const expressJwt = require('express-jwt');
const fs= require('fs');
const {Post}= require('../models/Post');



//function to check authentication
//checking if current token in cookies contain this secret or not
//no token -> no secret -> no authentication
//the same secret is used to generate token 
//responsible for generating req.user...(which contains req._id and req.name)
const requireSignin = expressJwt({
    secret: "DEEPAKKUMRAWAT",
//    userProperty: 'auth'
});

//jwt- used to generate token and stores it in cookies
//expressJwt- Middleware that checks if user has token and sets req.user.

//This module lets you authenticate HTTP requests using JWT tokens in your Node.js applications.
//JWTs are typically used to protect API endpoints, and are often issued using OpenID Connect.




//creating a post
router.post('/',requireSignin, async (req,res)=> {
    
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
        let post= new Post({
            title:req.body.title,
            body:req.body.body,
            postedBy: req.user._id, 
        })
        
        if(req.files){
            const file= req.files.file;
            const filename= Date.now()+'-'+file.name;
            await file.mv('./public/uploads/'+ filename);
            post.file= filename;
            console.log(file);
        }
        
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
        let posts= await Post.find().populate('postedBy');
        if(posts.length==0){
            res.status(400).send("No posts found");
        }
        res.send(posts);
    } 
    catch(err){
        console.log(err);
        res.status(500).send('Server error');
    }
})


//get all posts of a user(my posts)
router.get('/my_posts', requireSignin, async (req,res)=> {
    
    try{
        let posts= await Post.find({postedBy:req.user._id}).populate('postedBy');
        if(posts.length==0){
            res.status(400).send("No posts of this user");
        }
        res.send(posts);
    } 
    catch(err){
        console.log(err);
        res.status(500).send('Server error');
    }
})



//getting a post by post_id
router.get('/:id', requireSignin, async (req,res)=> {
    
    try{
        let post= await Post.findById(req.params.id).populate('postedBy');
        if(!post){
            return res.status(404).send("post not found");
        }
        res.send(post);
    } 
    catch(err){
        console.log(err);
        if(err.kind=="ObjectId"){
            return res.status(404).send("post not found");
        }
        res.status(500).send("Server error");
    }
})



//deleting a post
router.delete('/delete/:id', requireSignin, async (req,res)=> {
    
    try{
        let post= await Post.findById(req.params.id);
        if(!post){
            return res.status(404).send("post not found");
        }
        if(req.user._id !== post.postedBy.toString()){
            return res.status(401).send("you are not authorised to delete this post");
        }

        await post.remove();
        res.send("post is successfully removed");
    }
    catch(err){
        console.log(err);
        if(err.kind=="ObjectId"){
            return res.status(404).send("post not found");
        }
        res.status(500).send("server error");
    }
 
})

//updating a post (post created by me.. signed in user)
//can't update another user's post
router.put('/edit/:id', requireSignin, async (req, res)=> {
     
    try{
        let post= await Post.findById(req.params.id);
        if(!post){
            return res.status(404).send("post not found");
        }
        if(req.user._id !== post.postedBy.toString()){
            return res.status(401).send("you are not authorised to update this post");
        }
        
        
        //await fs.unlink('./public/uploads/'+ post.file);
        fs.unlinkSync('./public/uploads/'+ post.file);
        post.title= req.body.title;
        post.body= req.body.body; 
        
        if(req.files){
            const file= req.files.file;
            const filename= Date.now()+'-'+file.name;
            await file.mv('./public/uploads/'+ filename);
            post.file= filename;
            console.log(file);
        }
        
        await post.save();
        res.send("post updated");     
    }
    
    catch(err){
        console.log(err);
        res.status(500).send("Server error");
    }
      
})





module.exports= router;