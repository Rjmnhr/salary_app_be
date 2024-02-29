const express = require("express");
const router = express.Router();
const { PDFDocument, rgb } = require("pdf-lib");

router.post("/generate-watermark-pdf", async (req, res) => {
  const htmlContent = req.body.htmlContent;

  try {
    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(PDFDocument.Font.Helvetica);

    // Add a page to the document
    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();

    // Add HTML content to the page using the embedded font
    page.setFont(font);
    page.drawText(htmlContent, { x: 50, y: height - 100, size: 12 });

    // Add watermark to the page
    page.drawText("Watermark", { x: width / 2, y: height / 2, size: 36 });

    // Save the watermarked PDF or send it directly as a response
    const modifiedPdfBytes = await pdfDoc.save();

    res.setHeader("Content-Type", "application/pdf");
    res.send(modifiedPdfBytes);
  } catch (error) {
    console.error("Error generating watermarked PDF:", error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
