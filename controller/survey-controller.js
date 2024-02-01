const SurveyModel = require("../models/survey-model");
const nodemailer = require("nodemailer");

const notifyByMailRegistration = (data) => {
  const {
    name,
    email,
    phone,
    title,
    organization,
    sector,
    revenue,
    geographies,
  } = data;

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
    subject: `New Submission for Salary Survey`,
    text: `
    
We are pleased to inform you that a customer has submitted Salary Survey. Below are the details of the  customer:
    
Name: ${name}
Email: ${email}
Phone: ${phone}
Title: ${title}
Organization: ${organization}
Sector: ${sector}
Revenue: ${revenue}
Geographies: ${geographies}
   
    
    
Best regards,

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

const SurveyController = {
  uploadExcel: async (req, res) => {
    try {
      // Assuming the file is uploaded using multer and available in req.file.buffer
      const result = await SurveyModel.storeExcelData(
        req.file.buffer,
        req.body
      );

      const registerSubmission = await SurveyModel.register(req.body);

      if (registerSubmission) {
        notifyByMailRegistration(req.body);
      }

      res.status(200).json(result);
    } catch (err) {
      console.error(err);

      res.status(500).json({ message: "Internal Server Error" });
    }
  },
  register: async (req, res) => {
    try {
      // Assuming the file is uploaded using multer and available in req.file.buffer
      const result = await SurveyModel.register(req.body);

      if (result) {
        notifyByMailRegistration(req.body);
      }

      res.status(200).json(result);
    } catch (err) {
      console.error(err);

      res.status(500).json({ message: "Internal Server Error" });
    }
  },
};

module.exports = SurveyController;
