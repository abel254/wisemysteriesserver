import express from "express";
import { uploadPdf, getAllPdfs } from "../controller/pdfUploadController.js";


const pdfRouter = express.Router();


// Routes
pdfRouter.post("/upload", uploadPdf);
pdfRouter.get("/", getAllPdfs);

export default pdfRouter;