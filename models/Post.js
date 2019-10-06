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
    file: {
//        data: Buffer,
//        contenType: String
        type:String
    },
    postedBy: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    created: {
        type: Date,
        default: Date.now
    },
    updated: {
        type: Date
    },
    likes:
    [
      {
        user:{ 
            type: Schema.Types.ObjectId, 
            ref: 'user'
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
            ref: 'user'
         }
       }
     ]
});

const Post = mongoose.model('post', PostSchema);
module.exports = {Post};