import express from "express";
import fs from "fs";
import multer from "multer";
import path from "path";
import { uploadPdf, getAllPdfs } from "../controller/pdfUploadController.js";


const pdfRouter = express.Router();

// Ensure 'uploads' directory exists
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Set storage for uploaded PDFs
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
      return cb(new Error("Only PDF files are allowed!"), false);
    }
    cb(null, true);
  },
});

// Routes
pdfRouter.post("/upload", upload.single("pdf"), uploadPdf);
pdfRouter.get("/", getAllPdfs);

export default pdfRouter;