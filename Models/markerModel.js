const mongoose = require("mongoose")

const markerSchema = new mongoose.Schema({
    type: {
      type: String,
      enum: ['Feature'],
      required: true
    },
    properties: {
      id: {
        type: String,
        required: true
      }
    },
    geometry: {
      type: {
        type: String,
        enum: ['Point'],
        required: true
      },
      coordinates: {
        type: [Number],
        required: true
      }
    }
  });
  
  
  
  module.exports = mongoose.model('Marker', markerSchema);