const { Schema, model } = require("mongoose")


const userSchema = new Schema({
    name:{
        type: String,
        required: true,
        trim: true
    },
    email:{
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password:{
        type: String,
        trim: true,
        required: true,
    },
    info:{
        type: String,
    },
    photo: {
        type: String,
        trim: true
    },
    is_user_active:Boolean,
    refresh_token:{
        type: String,
        trim: true
    },
    activation_link: String
},{
    timestamps: true
});

module.exports = model('User', userSchema);