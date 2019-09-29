const express= require('express');
const router= express.Router();
const {Post}= require('../models/Post');

router.get('/',(req,res)=> {
    res.send("hello");
})



router.post('/',(req,res)=> {
    
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
        res.status(400).send(errors);
    }
    else{     
        const post= new Post(req.body);
        post.save().then((post)=> {
            res.send(post);
        }).catch(err=> {
            console.log(err);
            res.status(500).send('Server error');
        })    
    } 
    
})


router.get('/all_posts',(req,res)=> {
    
    Post.find().then(posts=> {
        if(posts){
            res.send(posts);
        }
    }).catch(err=> {
        console.log(err);
        res.status(500).send('Server error');
    })
})





module.exports= router;