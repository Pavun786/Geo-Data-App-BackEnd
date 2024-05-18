const mongoose = require("mongoose")

const DistancePointSchema = new mongoose.Schema({
  point1: {
    type: [Number],
    required: true,
  },
  point2: {
    type: [Number],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Point', DistancePointSchema);
