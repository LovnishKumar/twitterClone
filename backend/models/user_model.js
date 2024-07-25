const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullName: {
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
    profileImg: {
        type: String,
    },
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PostModel' // Assuming 'PostModel' is the name of your Post schema/model
    }],
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserModel'
    }],
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserModel'
    }],
    likedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserModel', // Reference to the user who liked the post
      },
   
});

mongoose.model("UserModel", userSchema);
