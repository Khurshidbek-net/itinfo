const { Schema, model, default: mongoose } = require("mongoose")


const categorySchema = new Schema({
    category_name:{
        type: String,
        uppercase: true,
        unique: true,
        required: true,
        trim: true
    },

    parent_category_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        default: null
    }
});

module.exports = model('Category', categorySchema);