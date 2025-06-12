const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  problem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Problem',
    required: true
  },
  language: {
    type: String,
    required: true
  },
  code: {
    type: String,
    required: true
  },
  verdict: {
    type: String,
    enum: ['Accepted', 'Wrong Answer', 'Runtime Error', 'Compilation Error', 'Time Limit Exceeded'],
    default: 'Pending'
  },
  output: {
    type: String
  },
  expectedOutput: {
    type: String
  },
  time: {
    type: String
  },
  memory: {
    type: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Submission_AGH', submissionSchema);
