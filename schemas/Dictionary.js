const { Schema, model } = require("mongoose")

const dictionarySchema = new Schema({
    term:{
        type: String,
        uppercase: true,
        requried: true,
        trim: true,
    },
    letter:{
        type: String,
        uppercase: true
    }
},{
    versionKey: false
});

module.exports = model("Dictionary", dictionarySchema);