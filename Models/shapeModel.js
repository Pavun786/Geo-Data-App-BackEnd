const mongoose = require("mongoose")

const shapeSchema = new mongoose.Schema({
    shapes: {
        type: Object
    }
  });

module.exports = mongoose.model("Shape",shapeSchema)  