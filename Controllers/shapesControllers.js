const Shape = require("../Models/shapeModel")

const createShapes = async (req, res) => {
    const { shapes } = req.body;
    await Shape.updateOne({}, { shapes }, { upsert: true });
    res.status(200).send({ message: 'Shapes saved successfully' });
  }
  
 const getShapes = async (req, res) => {
    const shapeData = await Shape.findOne({});
    res.status(200).send(shapeData);
  }

 const editShapes = async (req, res) => {
    try {
      const { shapes } = req.body;
      const newShape = new Shape(shapes);
      await newShape.save();
      res.status(200).json({ message: 'Shapes saved successfully!' });
    } catch (error) {
      console.error('Error saving shapes:', error);
      res.status(500).json({ error: 'Failed to save shapes' });
    }
  }
  

  module.exports = {getShapes,createShapes,editShapes}