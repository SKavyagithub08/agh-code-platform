const mongoose = require('mongoose');
 
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  solvedProblems: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Problem'
    }
  ]
}, { timestamps: true });
 
module.exports = mongoose.model('User', userSchema);
 
 