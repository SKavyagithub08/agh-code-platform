// models/DailyProblem.js
const mongoose = require('mongoose');

const dailyProblemSchema = new mongoose.Schema({
  problems: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Problem'
  }],
  startDate: {
    type: Date,
    required: true
  },
  currentIndex: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('DailyProblem', dailyProblemSchema);
