const express= require('express');
const jwt = require('jsonwebtoken');
const {User}= require('../models/User');
const router= express.Router();
//const _ = require('lodash');
//const { OAuth2Client } = require('google-auth-library');

const bcrypt = require('bcryptjs');
//const gravatar= require('gravatar');




//user signup
router.post('/signup', async (req,res)=> {
    
    let errors=[];
    let isEmail=  /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(req.body.email);
    
    if(!req.body.name){
        errors.push({message:'Enter name'});
    }
    if(!req.body.email){
        errors.push({message:'Enter email'});
    }  
    if(!isEmail){
        errors.push({message:'Invalid email'});
    }
    if(!req.body.password){
        errors.push({message:'Enter password'});
    }
    if(req.body.password.length<4){
        errors.push({message:'Password length must be greater than 3'});
    }
    
    
    if(errors.length>0){
        res.status(400).send(errors);
    }
    else{
        
        try{
            let user= await User.findOne({email:req.body.email});
            if(user){
                let errors=[];
                errors.push({message:'A user with this email already exists'});
                res.status(400).send(errors);
            }
            else{
                
                const salt= await bcrypt.genSalt(10);
                const hash= await bcrypt.hash(req.body.password, salt);
                
                user= new User({
                    name:req.body.name,
                    email:req.body.email,
                    password:hash
                });
                
                await user.save();
                res.send('user saved');
          
            }
            
          } catch(err){
              console.log(err);
              res.status(500).send('server error');
          }
       
    }  
})



//user signin
router.post('/signin', async (req,res)=> {
    
    
    let user= await User.findOne({email:req.body.email});
    
    if(!user){
        let errors=[];
        errors.push({message:'this email is not registered'});
        return res.status(400).send(errors);
    }
    
    let isMatched= await bcrypt.compare(req.body.password, user.password);
    
    if(!isMatched){
        let errors=[];
        errors.push({message:'passwords do not match'});
        return res.status(400).send(errors);
    }
    
    // generate a token with user id and secret
    const JWT_SECRET= "DEEPAKKUMRAWAT";
    const token = jwt.sign({_id: user._id, name: user.name}, JWT_SECRET);
    
    // persist the token as 't' in cookie with expiry date
    res.cookie('t', token, { expire: new Date() + 9999 });
    
    // retrun response with user and token to frontend client
    return res.send({ token, user });
    
    //token in stored in cookie and it can be accessed by client on frontend also..two ways above
     
})



//user signout
router.get('/signout',(req,res)=> {  
    res.clearCookie('t');
    return res.json({ message: 'Signout success!' });   
})






module.exports = router;