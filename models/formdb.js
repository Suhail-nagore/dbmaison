
const mongoose = require("mongoose");

const formschema = new mongoose.Schema({
    name: String,
    email: String,
    Number: Number,
    message: String,
    timestamp: {
        type: Date,
        default: Date.now,
      },
});

const Form = mongoose.model("Form", formschema);
module.exports = Form