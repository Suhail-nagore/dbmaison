const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },

    headings:{
        type:[String],
        require:true,
    },

    image: {
        type: String, // Assuming you will store the image URL
        required: true
    },
    content: {
        type: [String], // Array of paragraphs
        required: true
    },
    youtube: {
        type: String,
        required: true
    }
}, {
    timestamps: true // Adds createdAt and updatedAt fields
});

const Blog = mongoose.model("Blog", blogSchema);
module.exports = Blog;
