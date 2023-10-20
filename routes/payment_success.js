const jwt = require("jsonwebtoken"); // Import the jsonwebtoken library
const express = require("express");
const nodemailer = require("nodemailer"); // Import the Nodemailer library
const fs = require("fs");

// Create a Nodemailer transporter with your email service provider's configuration
const transporter = nodemailer.createTransport({
  service: "Gmail", // Example: 'Gmail' or 'SMTP'
  auth: {
    user: "team@equipaypartners.com",
    pass: process.env.EQUIPAY_MAIL_APP_PASS,
  },
});

const sendTheProduct = (email, filePath) => {
  const pdfContent = fs.readFileSync(filePath);

  const mailOptions = {
    from: "team@equipaypartners.com",
    to: email, // User's email address
    subject: "Your Purchased Product",
    text: `Dear customer,

Thank you for purchasing our report. Your PDF report is attached to this email.
    

    
If you encounter any issues or have questions, please don't hesitate to contact us at team@equipaypartners.com or +91 6361421365.
    
Best regards,
Equipay Partners`,
    attachments: [
      {
        filename: "Executive",
        content: pdfContent, // You can read the PDF content here or provide the path to the PDF file,
        contentType: "application/pdf",
      },
    ],
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).send("Email sending failed");
    } else {
      console.log("Email sent: " + info.response);
      res.status(200).send("Email sent successfully");
    }
  });
};

const router = express.Router();

router.post("/payment-success", async (req, res) => {
  // Process the successful payment

  // Generate a JWT to grant access to the PDF file
  const tokenPayload = {
    sessionId: req.body.sessionId, // Assuming you have a user ID
    file: "CEO_pay_NSE100.pdf", // The PDF file you want to grant access to
    email: req.body.email,
  };

  const secretKey = process.env.SECRET_KEY; // A secret key for signing the JWT

  // Generate the JWT
  const accessToken = jwt.sign(tokenPayload, secretKey, { expiresIn: "1h" });

  // Redirect the user to a route that serves the PDF with the JWT
  res.redirect(`/send-pdf?token=${accessToken}`);
});

router.get("/send-pdf", (req, res) => {
  const accessToken = req.query.token; // Retrieve the JWT from the query parameter
  const secretKey = process.env.SECRET_KEY; // The same secret key used to sign the JWT

  // Verify the JWT
  jwt.verify(accessToken, secretKey, (err, decoded) => {
    if (err) {
      // If the JWT is invalid or has expired, deny access
      res.status(403).send("Unauthorized");
    } else {
      // If the JWT is valid, allow access to the PDF
      const fileName = decoded.file; // Extract the file name from the JWT payload
      const email = decoded.email;
      const filePath = `./${fileName}`;

      sendTheProduct(email, filePath);
    }
  });
});

module.exports = router;
