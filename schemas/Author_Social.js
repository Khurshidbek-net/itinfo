const {Schema, model} = require("mongoose");


const authorSocialSchema = new Schema({
    author_id:{
        type: Schema.Types.ObjectId,
        require: true,
        ref:'Author'
    },
    social_id:{
        type: Schema.Types.ObjectId,
        require: true,
        ref: 'Social'
    },
    social_link:{
        type: String,
        trim: true,
        require: true
    }

});

module.exports = model('AuthorSocial', authorSocialSchema);