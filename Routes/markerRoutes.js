const express = require("express");

const {getMarker,createMarker,deleteMarker} = require("../Controllers/markerControllers");
const router = express.Router()

router.get("/markers",getMarker)

router.post("/markers",createMarker)

router.delete("/markers/:id",deleteMarker)



module.exports = router;