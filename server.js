const express = require('express');
const mongoose = require('mongoose');
// const path = require('path');
const dotenv = require("dotenv")
const dbConnection = require("./db_Connection/db.js")
const cors = require('cors');
// const fs = require('fs');
const authRoute = require("./Routes/userRoutes")
const markerRoute = require("./Routes/markerRoutes.js")
const fileRoute = require("./Routes/fileRoutes.js")
const shapeRoute = require("./Routes/shapesRoutes.js")
const distancePointesRoute = require("./Routes/distancePointesRoutes.js")
dotenv.config()

const app = express();
app.use(cors({
     origin : "https://geo-data-app-front-end.vercel.app"
}));
app.use(express.json());
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use("/auth",authRoute)
app.use("/route",markerRoute)
app.use("/route",fileRoute)
app.use("/route",shapeRoute)
app.use("/api",distancePointesRoute)

// Ensure the uploads directory exists
// const uploadsDir = path.join(__dirname, 'uploads');
// if (!fs.existsSync(uploadsDir)) {
//   fs.mkdirSync(uploadsDir);
// }


dbConnection()

app.get("/",(req,res)=>{
   res.send("Welcome to Geo-Data App")
})

app.listen(3001, () => {
  console.log('Server running on port 3001');
});
