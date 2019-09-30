const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const PostSchema= new Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    photo: {
        data: Buffer,
        contenType: String
    },
    postedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    created: {
        type: Date,
        default: Date.now
    },
    updated: {
        type: Date,
        default: Date.now
    },
    likes:
    [
      {
        user:{ 
            type: Schema.Types.ObjectId, 
            ref: 'User'
        }
      }  
    ],
    
    comments:
    [
      {
         text: {
            type:String,
         },
         created:{
            type: Date,
            default: Date.now
         },
         postedBy: {
            type: Schema.Types.ObjectId,
            ref: 'User'
         }
       }
     ]
});

const Post = mongoose.model('post', PostSchema);
module.exports = {Post};