const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  geojson: {
    type: Object,
    required: true
  }
});

module.exports = mongoose.model("File", fileSchema);
