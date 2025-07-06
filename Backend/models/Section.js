const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema({
    coverImage: {
        type: String,
        required: true,
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    companies: [{
        type: String,
        required: true
    }],
    easyQuestions: {
        type: Number,
        required: true,
        default: 0
    },
    mediumQuestions: {
        type: Number,
        required: true,
        default: 0
    },
    hardQuestions: {
        type: Number,
        required: true,
        default: 0
    },
    noOfQuestions: {
        type: Number,
        required: true,
        validate: {
            validator: function (v) {
                return v === this.easyQuestions + this.mediumQuestions + this.hardQuestions;
            },
            message: props => `noOfQuestions must be equal to the sum of easy, medium, and hard questions.`
        },
        default: 0,
    },
}, { timestamps: true });

module.exports = mongoose.model('Section_AGH', sectionSchema);
