const {Schema, model} = require("mongoose");


const topicSchema = new Schema({
    author_id: {
        type: Schema.Types.ObjectId,
        ref: 'Author'
    },
    topic_title:{
        type: String,
        required: true,
        trim: true
    },
    topic_text:{
        type: String,
        required: true,
        trim: true
    },
    is_checked: Boolean,
    is_approved: Boolean,
    expert_id:{
        type: Schema.Types.ObjectId,
        ref: 'Author'
    }
}, {
    timestamps: true
});

module.exports = model('Topic', topicSchema);