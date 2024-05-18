const express = require("express");

const {findPointer,createPointer} = require("../Controllers/distancePointController");
const router = express.Router()

router.get("/get-points",findPointer)

router.post("/save-points",createPointer)


module.exports = router;