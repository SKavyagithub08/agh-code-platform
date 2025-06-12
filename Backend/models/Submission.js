const mongoose = require('mongoose');
 
const submissionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  problem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Problem',
    required: true,
  },
  language: {
    type: String,
    enum: ['C++', 'Python', 'Java', 'JavaScript', 'C', 'Go', 'Rust', 'Other'],
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  verdict: {
    type: String,
    enum: ['Accepted', 'Wrong Answer', 'Runtime Error', 'Time Limit Exceeded', 'Compilation Error', 'Memory Limit Exceeded', 'Internal Error'],
    default: 'Pending',
  },
  time: {
    type: Number, // in milliseconds
    default: 0,
  },
  memory: {
    type: Number, // in kilobytes (KB)
    default: 0,
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  }
});
 
module.exports = mongoose.model('Submission', submissionSchema);