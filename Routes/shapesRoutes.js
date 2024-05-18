const express = require("express");

const {createShapes,getShapes,editShapes} = require("../Controllers/shapesControllers");
const router = express.Router()

router.get("/shapes",getShapes)

router.post("/shapes",createShapes)

router.put("/shapes/:id",editShapes)



module.exports = router;