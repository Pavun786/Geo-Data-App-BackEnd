const File = require("../Models/fileModel")
const path = require('path');
const { DOMParser } = require('xmldom');
const toGeoJSON = require('@mapbox/togeojson');
const xml2js = require('xml2js');
const fs = require('fs');
 
  // Function to parse KML to GeoJSON
  const parseKML = (kmlString) => {
    const kml = new DOMParser().parseFromString(kmlString, 'text/xml');
    const geojson = toGeoJSON.kml(kml);
    return geojson;
  };
  
  // Function to parse GeoJSON
  const parseGeoJSON = (geojsonString) => {
    return JSON.parse(geojsonString);
  };
  

  // API endpoints
  const uploadFile = async (req, res) => {
    try {
      const filePath = req.file.path;
      const fileType = req.file.mimetype;
      let geojson = null;
  
      // Read and parse the file
      const fileData = fs.readFileSync(filePath, 'utf8');
  
      if (fileType === 'application/vnd.google-earth.kml+xml' || path.extname(req.file.filename) === '.kml') {
        geojson = parseKML(fileData);
      } else if (fileType === 'application/geo+json' || fileType === 'application/json' || path.extname(req.file.filename) === '.geojson') {
        geojson = parseGeoJSON(fileData);
      } else {
        return res.status(400).json({ message: 'Unsupported file type' });
      }
  
      const newFile = new File({
        filename: req.file.filename,
        path: req.file.path,
        type: req.file.mimetype,
        geojson,
      });
  
      await newFile.save();
      res.status(201).json({ message: 'File uploaded successfully', file: newFile });
    } catch (error) {
      console.error('Error uploading file:', error);
      res.status(400).json({ message: 'Error uploading file', error });
    }
  };
  
  
  
const getAllFiles = async (req, res) => {
    const files = await File.find();
    res.status(200).json(files);
  }
  
const getSingleFile = async (req, res) => {
    try {
      const file = await File.findById(req.params.id);
      if (!file) {
        return res.status(404).json({ message: 'File not found' });
      }
      res.status(200).json(file);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  }

  module.exports = {uploadFile,getAllFiles,getSingleFile}
  

  