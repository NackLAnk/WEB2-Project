const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema( {
    text: {
        type: String,
        require: true,
    },
    title: {
        type: String,
        require: true,
    },
    author: {
        type: String,
        require: true,
    },
    post_image: {
        type: String,
        require: true,
    },
}, { timestamps: true });

const Post = mongoose.model('Post', postSchema);
module.exports = Post
