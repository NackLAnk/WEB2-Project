const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ratingSchema = new Schema({
    author: {
        type: String,
        require: true
    },
    grade: {
        type: String,
        require: true
    },
    Comment: {
        type: String,
    },
}, { timestamps: true });

const Rating = mongoose.model('Rating', ratingSchema);
module.exports = Rating;