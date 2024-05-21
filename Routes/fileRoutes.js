// const express = require("express");
// const multer = require('multer');
// const path = require('path');
// const {uploadFile,getAllFiles,getSingleFile} = require("../Controllers/fileControllers");
// const router = express.Router()

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//       cb(null, 'uploads/');
//     },
//     filename: (req, file, cb) => {
//       cb(null, Date.now() + '-' + file.originalname);
//     },
//   });
  
//   const upload = multer({ storage });

// router.post("/upload",upload.single('file'), uploadFile)

// router.get("/files",getAllFiles)

// router.get("/files/:id",getSingleFile)

// module.exports = router;

const express = require("express");
const multer = require('multer');
const { uploadFile, getAllFiles, getSingleFile } = require("../Controllers/fileControllers");
const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/upload", upload.single('file'), uploadFile);
router.get("/files", getAllFiles);
router.get("/files/:id", getSingleFile);

module.exports = router;
