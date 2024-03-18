const puppeteer = require("puppeteer");
const fs = require("fs");
const router = require("express").Router();

async function htmlToPdf(htmlCode, outputPath) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Set the content of the page with the HTML code
  await page.setContent(htmlCode);

  // Generate PDF from the HTML content
  await page.pdf({ path: outputPath, format: "A4" });

  // Close the browser
  await browser.close();

  console.log(`PDF saved at: ${outputPath}`);
}

router.post("/generatePDF", (req, res) => {
  const htmlCode = req.body.htmlCode;
  const outputPath = "./output.pdf";
  htmlToPdf(htmlCode, outputPath);
  });

module.exports = router;
