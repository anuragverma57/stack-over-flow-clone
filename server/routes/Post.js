import express  from "express";
const router=express.Router();

const upload=multer({
    storage:imgconfig,
    fileFilter:isImage
})


export default router