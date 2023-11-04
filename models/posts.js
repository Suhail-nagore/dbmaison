const mongoose = require("mongoose")
const postSchema = new mongoose.Schema({
    title: String,
    content: String,
    author: String,
    specifications: [String], // Store specifications as an array of strings
    Lspec: String,
    youtube: String,
    mapH: String,
    mapV: String,
    type: String,
    features: [String],
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  });
  
  const Post = mongoose.model("Post", postSchema, "post");
  module.exports= Post