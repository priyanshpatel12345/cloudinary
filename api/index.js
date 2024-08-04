import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import fileupload from "express-fileupload";
import fileRouter from "../routes/fileUpload.js";

mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log("MongoDB is connected"); 
}).catch((err) => {
    console.log("Error from Mongodb Connection",err);
})


const app = express();
const port = 3000;

app.use(express.json());
app.use(fileupload( {useTempFiles : true,
    tempFileDir : '/tmp/'}));

import { v2 as cloudinary } from 'cloudinary';
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.API_SECRET
});

app.use("/api/upload/fileUpload", fileRouter);

app.listen(port, () => {
    console.log(`server is running on port ${port}`);
});

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(statusCode).json({
        statusCode,
        message
    });
});