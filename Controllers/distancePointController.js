const DistancePointer = require("../Models/distancePointerModel")

const createPointer = async(req, res)=>{
     try{

        const { point1, point2 } = req.body;
  
        const newPoint = new DistancePointer({
          point1,
          point2,
        });
      
        await newPoint.save();
      
        res.status(200).json({ message: 'Points saved successfully' });

     }catch(error){
        res.status(500).json({ message: error.message });
     }
  }

 const findPointer = async(req, res)=> {
    
     try{
        const points = await DistancePointer.find({});
        res.status(200).json(points);
     }catch(error){
        res.status(500).json({ message: error.message });
     }
    
  }  

  module.exports = {findPointer,createPointer}  