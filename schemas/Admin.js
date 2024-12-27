const { Schema, model } = require("mongoose");


const adminSchema = new Schema({
  name: {
    type: String,
    require: true,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    required: true,
    unique: true
  },
  phone: {
    type: String,
    trim: true,
    required: true,
  },
  password: {
    type: String,
    trim: true,
    required: true,
  },
  is_active: Boolean,
  is_creator: Boolean,
  refresh_token: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});



module.exports = model('Admin', adminSchema);