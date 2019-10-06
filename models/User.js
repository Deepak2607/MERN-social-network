const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const UserSchema= new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    
    created: {
        type: Date,
        default: Date.now
    },
    updated: {
        type: Date
    },
    photo: {
        data: Buffer,
        contentType: String
    },
    about: {
        type: String,
        trim: true
    },
    
    following:
    [
      { 
        user:{ 
            type: Schema.Types.ObjectId, 
            ref: 'user'
        }
      }     
    ],
    
    followers:
    [
      {
        user:{ 
            type: Schema.Types.ObjectId, 
            ref: 'user'
        }
      }
    ],
    resetPasswordLink: {
        data: String,
        default: ""
    },
    role: {
        type: String,
        default: "subscriber"
    }
});


const User = mongoose.model('user', UserSchema);
module.exports = {User};