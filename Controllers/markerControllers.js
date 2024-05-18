const Marker = require("../Models/markerModel")


const getMarker = async (req, res) => {
    try {
      const markers = await Marker.find();
      res.json(markers);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
  
 const createMarker = async (req, res) => {
    try {
      const marker = new Marker(req.body);
      await marker.save();
      res.status(201).json(marker);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
  
  const deleteMarker = async (req, res) => {
    try {
      const { id } = req.params;
      await Marker.deleteOne({ 'properties.id': id });
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
  
  module.exports = {createMarker,getMarker,deleteMarker}