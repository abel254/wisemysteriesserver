import Pdf from "../model/pdfUploadModel.js";

export const uploadPdf = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No PDF file uploaded" });
    }

    const newPdf = new Pdf({
      title: req.body.title,
      pdfPath: req.file.path,
    });

    await newPdf.save();

    res.status(201).json({
      message: "PDF uploaded successfully",
      pdf: newPdf,
    });
  } catch (error) {
    console.error("Error uploading PDF:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllPdfs = async (req, res) => {
  try {
    const pdfs = await Pdf.find().sort({ createdAt: -1 });
    res.status(200).json(pdfs);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch PDFs" });
  }
};