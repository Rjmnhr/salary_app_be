const router = require("express").Router();
const nodemailer = require("nodemailer");

router.post("/send-enquiry", (req, res) => {
  const { name, subject, email, details } = req.body;

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
    from: "Equipay Partners <team@equipaypartners.com>",
    to: "renjithcm.renju@gmail.com, pannersmail@gmail.com, team@equipaypartners.com",
    subject: `Equipay Partners enquiry from ${name}  `,
    text: `Dear Equipay Partners,
    
We have received an enquiry from ${name}  through the contact us section of our website. 
The details of the enquiry are as follows:
Name: ${name}
Email: ${email}
Subject: ${subject}

Enquiry Details: ${details}`,
  };

  // Send the email
  transporter.sendMail(mailOptions, (error) => {
    if (error) {
      console.error("Error sending email:", error);
      res.status(500).json({ message: "Error sending Enquiry" });
    } else {
      res.status(200).json("Enquiry send successfully");
    }
  });
});

module.exports = router;
