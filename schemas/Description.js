const { Schema, model, default: mongoose } = require("mongoose")

const descSchema = new Schema({
    category_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
        default: null
    },
    description:{
        type: String,
        trim: true,
        required: true
    }
});


module.exports = model('Description', descSchema);