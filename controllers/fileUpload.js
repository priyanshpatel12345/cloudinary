import {File} from "../models/file.js";
import { errorHandler } from "../utils/err.js";
import { v2 as cloudinary } from 'cloudinary';
import path from "path";
import { fileURLToPath } from 'url';


// Define __dirname manually
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const localFileUpload = async(req, res) => {
    try {
        // fetch file from request
        const file = req.files.file;
        console.log("File is Here", file);
        
        // create path where we stored file on server
        let filePath = __dirname + "/files/" + Date.now() + `.${file.name.split(".")[1]}`;
        console.log("filePath => ", filePath);
        
        //add path to the move function
        file.mv(filePath, (err) => {
            console.log("error from File Save", err);  
        });

        //create a Successfully response
        res.json({
            success: true,
            message : "Local File upload Successfully",
        });
    } catch (error) {
        console.log(error); 
    }
};

async function uploadFileToCloudinary(file, folder) {
    const options = {folder};
    return await cloudinary.uploader.upload(file.tempFilePath, options);
};

function isFileTypeSupported(supportedTypes, fileType)  {
    
    return supportedTypes.includes(fileType);
};

// **********************************************************
// Image file upload on cloudinary 
// **********************************************************
export const imageUpload = async(req, res) => {
    try {

        //fetch data from request
        const {name, tags, email} = req.body;
        console.log(name, tags, email);

        const file = req.files.imageFile;
        console.log(file);


        //Validation 
        const supportedTypes = ["jpg","jpeg","png"];
        const fileType = file.name.split(".")[1].toLowerCase();
        console.log("File Type",fileType);
        
        if (!isFileTypeSupported(supportedTypes, fileType)) {
            return errorHandler(400, "File Type Not Supported");
        }    
             
        // if File Format is Supported
        const response = await uploadFileToCloudinary(file, "Practise_Image");
        console.log("response", response);
        

        // Entry save in DB
        const fileData = await File.create({
            name,
            email,
            tags,
            imageUrl: response.secure_url,
        });

        res.json({
            imageUrl:response.secure_url,
            message: "Image Upload SuccessFully"
        })

    } catch (error) {
        console.log(error);     
    }
};

// **********************************************************
// Video file upload on cloudinary 
// **********************************************************

async function uploadVideoToCloudinary(file, folder) {
    const options = {folder};
    options.resource_type = "auto";
    console.log("options => ",options);
    
    return await cloudinary.uploader.upload(file.tempFilePath, options);
};

export const videoUpload = async(req, res) => {
    try {
                //fetch data from request

        const {email, name, tags} = req.body;
        console.log(email, name, tags);

        const file = req.files.videoUpload;
        console.log(file);

        //Validation 
        const supportedTypes = ["mp4","mov"];
        const fileType = file.name.split(".")[1].toLowerCase();
        const maxSize = 5 * 1024 * 1024;
        console.log("File Type",fileType);

        if (!isFileTypeSupported(supportedTypes, fileType)) {
            return errorHandler(400, "File Type Not Supported");
        }    

         // if File Format is Supported
         const response = await uploadVideoToCloudinary(file, "Practise_Image");
         console.log("response", response);
         
           // Entry save in DB
        const fileData = await File.create({
            name,
            email,
            tags,
            imageUrl: response.secure_url,
        });

        res.json({
            imageUrl:response.secure_url,
            message: "Video Upload SuccessFully"
        })
 
        
    } catch (error) {
        console.log(error);
        
    }
};

// **********************************************************
// ImageReducer file upload on cloudinary 
// **********************************************************

async function uploadVideoToCloudinary2 (file, folder, quality, height) {
    const options = {folder};
    console.log("options => ",options);

    if (quality) {
        options.quality = quality;
    }

    if (height) {
        options.height = height;
    }
    
    return await cloudinary.uploader.upload(file.tempFilePath, options);
};

function isFileTypeSupported2(validationTypes, fileType) {
    return validationTypes.includes(fileType);
}

export const imageReducer = async(req, res) => {
   try {
     // fetch the data
     const {email, name, tags} = req.body;
    
     const file = req.files.imageFile;
     console.log(file);
 
     //Validation
     const supportedTypes = ["jpeg", "jpg", "png"];
     const fileType = file.name.split(".")[1].toLowerCase();
 
     if (!isFileTypeSupported2(supportedTypes, fileType)) {
         return errorHandler(400, "Image Type Not Supported");
     }  
 
      // if File Format is Supported
      const response = await uploadVideoToCloudinary2(file, "Practise_Image", 70, 250);
      console.log("response", response);
 
     // Entry save in DB
            const fileData = await File.create({
             name,
             email,
             tags,
             imageUrl: response.secure_url,
     });
 
     res.json({
             imageUrl:response.secure_url,
             message: "Image Upload SuccessFully"
     })
 
   } catch (error) {
    console.log(error);
    
   }
    
};

