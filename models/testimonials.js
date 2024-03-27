
const mongoose = require("mongoose");

const testiSchema = new mongoose.Schema({
    name: String,
    Designation: String,
    image: String,
    company: String,
    message: String,
    state:{
        type:Boolean,
        default:1,
    },
    timestamp: {
        type: Date,
        default: Date.now,
      },
});

const Testi = mongoose.model("testi", testiSchema);
module.exports = Testi