const {Schema, model} = require("mongoose");

const authorSchema = new Schema({
    first_name:{
        type: String,
        trim: true,
        required: true,
        uppercase: true
    },
    last_name:{
        type: String,
        trim: true,
        required: true,
        uppercase: true
    },
    nick_name:{
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    email:{
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    phone:{
        type: String,
        trim: true,
        required: true,
    },
    password:{
        type: String,
        trim: true,
        required: true,
    },
    info:{
        type: String,
        trim: true,
        required: true,
    },
    position:{
        type: String,
        trim: true,
        required: true,
        uppercase: true,
    },
    photo:{
        type: String,
        trim: true,
        required: true,
    },
    is_expert:Boolean,
    author_is_active: Boolean,
    refresh_token:{
        type: String,
        trim: true
    },
    activation_link: String
});



module.exports = model('Author', authorSchema);