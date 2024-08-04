import mongoose from "mongoose";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const fileSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
    }, 
    tags: {
        type: String,
    },
    email: {
        type: String,
    }  
});

fileSchema.post("save", async function(doc) {
    try {
        // transporter
        let transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASSWORD
            },
        });

        // send mail
        let info = await transporter.sendMail({
            from : 'priyanshPatel',
            to : doc.email,
            subject : "New file upload on Cloudinary",
            html : `<h2>Hello ${doc.name}</h2> <p>File Uploaded View here:<a href=${doc.imageUrl}>${doc.imageUrl}</a></p>`
        });

        console.log(info);
        
    } catch (error) {
        console.error(error);
    }
})



export const File = mongoose.model("File", fileSchema);