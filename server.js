// const express = require('express');
// const mongoose = require('mongoose');
// const multer = require('multer');
// const path = require('path');
// const dotenv = require("dotenv")
// const dbConnection = require("./db_Connection/db.js")
// const cors = require('cors');
// const fs = require('fs');
// dotenv.config()

// const app = express();
// app.use(cors());
// app.use(express.json());
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// // Database setup
// // mongoose.connect('mongodb://localhost:27017/geodata', { useNewUrlParser: true, useUnifiedTopology: true });

// const uploadsDir = path.join(__dirname, 'uploads');
// if (!fs.existsSync(uploadsDir)) {
//   fs.mkdirSync(uploadsDir);
// }

// dbConnection()

// const fileSchema = new mongoose.Schema({
//   filename: String,
//   path: String,
//   type: String,
//   location: {
//     type: { type: String, enum: ['Point'], default: 'Point' },
//     coordinates: { type: [Number], default: [0, 0] },
//   },
// });

// const File = mongoose.model('File', fileSchema);

// // Multer setup for file uploads
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/');
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + '-' + file.originalname);
//   },
// });

// const upload = multer({ storage });

// // API endpoints
// app.post('/upload', upload.single('file'), async (req, res) => {
//     const { latitude, longitude } = req.body;  // Expect latitude and longitude in the request body
//     const newFile = new File({
//       filename: req.file.filename,
//       path: req.file.path,
//       type: req.file.mimetype,
//       location: {
//         coordinates: [parseFloat(longitude), parseFloat(latitude)],
//       },
//     });
//     await newFile.save();
//     res.status(201).json({ message: 'File uploaded successfully', file: newFile });
//   });

// app.get('/files/:id', async (req, res) => {
//     try {
//       const file = await File.findById(req.params.id);
//       if (!file) {
//         return res.status(404).json({ message: 'File not found' });
//       }
//       res.status(200).json(file);
//     } catch (error) {
//       res.status(500).json({ message: 'Server error' });
//     }
// })
// app.get('/files', async (req, res) => {
//   const files = await File.find();
//   res.status(200).json(files);
// });

// app.listen(3001, () => {
//   console.log('Server running on port 3001');
// });


// server.js (Backend)
// server.js (Backend)


//==================================================================================================


const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const dotenv = require("dotenv")
const dbConnection = require("./db_Connection/db.js")
const cors = require('cors');
const fs = require('fs');
const { DOMParser } = require('xmldom');
const toGeoJSON = require('@mapbox/togeojson');
const xml2js = require('xml2js');
dotenv.config()

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ensure the uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Database setup
dbConnection()

const fileSchema = new mongoose.Schema({
  filename: String,
  path: String,
  type: String,
  geojson: Object,
});

const shapeSchema = new mongoose.Schema({
  shapes: Object,
});

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

const Marker = mongoose.model('Marker', markerSchema);
const File = mongoose.model('File', fileSchema);
const Shape = mongoose.model('Shape', shapeSchema);

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage });

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
app.post('/upload', upload.single('file'), async (req, res) => {
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
});

app.get('/files', async (req, res) => {
  const files = await File.find();
  res.status(200).json(files);
});

app.get('/files/:id', async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }
    res.status(200).json(file);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/shapes', async (req, res) => {
  const { shapes } = req.body;
  await Shape.updateOne({}, { shapes }, { upsert: true });
  res.status(200).send({ message: 'Shapes saved successfully' });
});

app.get('/shapes', async (req, res) => {
  const shapeData = await Shape.findOne({});
  res.status(200).send(shapeData);
});

// app.post('/shapes', async (req, res) => {
//   const { shapes } = req.body;
//   console.log(shapes)
//   try {
    
//     await Shape.create(shapes);
//     res.status(200).json({ message: 'Shapes saved successfully' });
//   } catch (error) {
//     console.error('Error saving shapes:', error);
//     res.status(500).json({ error: 'An error occurred while saving shapes' });
//   }
// });

// app.post('/shapes', async (req, res) => {
//   const { shapes } = req.body;
//   console.log(shapes)
//   try {
    
//     await Shape.create(shapes);
//     res.status(200).json({ message: 'Shapes saved successfully' });
//   } catch (error) {
//     console.error('Error saving shapes:', error);
//     res.status(500).json({ error: 'An error occurred while saving shapes' });
//   }
// });

// PUT route to update drawn shapes
app.put('/shapes/:id', async (req, res) => {
  try {
    const { shapes } = req.body;
    const newShape = new Shape(shapes);
    await newShape.save();
    res.status(200).json({ message: 'Shapes saved successfully!' });
  } catch (error) {
    console.error('Error saving shapes:', error);
    res.status(500).json({ error: 'Failed to save shapes' });
  }
});


app.get('/markers', async (req, res) => {
  try {
    const markers = await Marker.find();
    res.json(markers);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/markers', async (req, res) => {
  try {
    const marker = new Marker(req.body);
    await marker.save();
    res.status(201).json(marker);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/markers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Marker.deleteOne({ 'properties.id': id });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.listen(3001, () => {
  console.log('Server running on port 3001');
});
