const mongoose = require("mongoose")


const dbConnection = async(req,res)=>{
    try{
       await mongoose.connect(process.env.MONGO_URL)
       console.log("The db conected successfully")
    }catch(err){
        console.log(err)
    }
}

module.exports = dbConnection