import express from "express";
const router = express.Router();

import { imageReducer, imageUpload, localFileUpload, videoUpload}  from "../controllers/fileUpload.js";

router.post("/localFileUpload", localFileUpload);
router.post("/imageUpload", imageUpload);
router.post("/videoUpload", videoUpload);
router.post("/imageReducer", imageReducer);




export default router;