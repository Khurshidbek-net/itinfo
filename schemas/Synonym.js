const { Schema, model, default: mongoose } = require("mongoose")

const synonymSchema = new Schema({
    desc_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Description',
        required: true
    },
    dict_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Dictionary',
        required: true
    }
});


module.exports = model('Synonym', synonymSchema);