
const mongoose = require("mongoose");

const aboutSchema = new mongoose.Schema({
    image:String,
});

const About = mongoose.model("aboutSchema", aboutSchema);
module.exports = About