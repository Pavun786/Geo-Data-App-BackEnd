const mongoose = require("mongoose")


const fileSchema = new mongoose.Schema({
    filename: {
        type : String
    },
    path: {
        type: String
    },
    type: {
        type : String
    },
    geojson : {
        type : Object
    }
  });

module.exports = mongoose.model("File",fileSchema)  