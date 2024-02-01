const express = require("express");
const multer = require("multer");
const SurveyController = require("../controller/survey-controller");
const nodemailer = require("nodemailer");

const notifyByMailDownload = (ipAddress) => {
  // Create a Nodemailer transporter
  const transporter = nodemailer.createTransport({
    service: "Gmail", // Example: 'Gmail' or 'SMTP'
    auth: {
      user: "team@equipaypartners.com",
      pass: process.env.EQUIPAY_MAIL_APP_PASS,
    },
  });

  // Set up email data
  const mailOptions = {
    from: "team@equipaypartners.com",
    to: "renjithcm.renju@gmail.com",
    // to: "indradeep.mazumdar@gmail.com",
    subject: `Salary Survey Template Download`,
    text: `Admin,
    
A user has downloaded the Salary Survey Template Excel file.

User IP Address: ${ipAddress}

Regards,
Equipay Partners Team
  `,
  };

  // Send the email
  transporter.sendMail(mailOptions, (error) => {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log(" send successfully");
    }
  });
};

const captureIpAddress = (req, res, next) => {
  const ipAddress =
    req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  req.userIpAddress = ipAddress;
  next();
};

const router = express.Router();
const upload = multer();

// Define your routes
router.post(
  "/upload-excel",
  upload.single("file"),
  SurveyController.uploadExcel
);
router.post("/register", SurveyController.register);

router.get("/template-download", captureIpAddress, (req, res) => {
  notifyByMailDownload(req.userIpAddress);
});

module.exports = router;
