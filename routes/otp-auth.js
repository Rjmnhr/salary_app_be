const router = require("express").Router();
const nodemailer = require("nodemailer");
const otplib = require("otplib");
const NodeCache = require("node-cache");

const otpCache = new NodeCache();

router.post("/send-otp", (req, res) => {
  const { email } = req.body;

  const secret = otplib.authenticator.generateSecret();
  const otp = otplib.authenticator.generate(secret);

  // Store OTP in cache with the email as the key
  otpCache.set(email, otp, 600); // Set OTP to expire in 10 minutes (600 seconds)

  // Create a Nodemailer transporter
  const transporter = nodemailer.createTransport({
    host: "smtp-mail.outlook.com",
    port: 587,
    secure: false,
    auth: {
      user: "info@2ndstorey.com",
      pass: "secondstorey",
    },
  });

  // Set up email data
  const mailOptions = {
    from: "info@2ndstorey.com",
    to: email,
    subject: "Your One-Time Password (OTP) for 2nd Storey",
    text: `Thank you for using 2nd Storey. To complete your login or verification process, please use the following one-time password (OTP):
    
Your OTP: ${otp}
  
Please enter this OTP on our platform within the next 5 minutes to verify your identity and gain access to your account or complete your requested action.
    
Security Reminder:

Keep this OTP confidential, and do not share it with anyone, including our support team.
We will never ask you for your OTP through email, phone, or any other means. If you receive such a request, please report it to us immediately.
If you didn't request this OTP or believe it to be a mistake, please disregard this email.
If you encounter any issues or have questions, please don't hesitate to contact our support team at info@2ndstorey.com .

Thank you for choosing 2nd Storey.

Best regards,
The 2nd Storey Team
    
    `,
  };

  // Send the email
  transporter.sendMail(mailOptions, (error) => {
    if (error) {
      console.error("Error sending email:", error);
      res.status(500).json({ message: "Failed to send OTP" });
    } else {
      res.status(200).json("Otp send successfully");
    }
  });
});

router.post("/verify-otp", (req, res) => {
  const { email, otp } = req.body;

  const storedOTP = otpCache.get(email);

  if (!storedOTP) {
    res.status(400).json({ message: "OTP data not found" });
    return;
  }

  if (storedOTP === otp) {
    // Clear the secret and token from session storage after successful verification

    otpCache.del(email);

    res.json({ message: "OTP verified successfully" });
  } else {
    res.status(400).json({ message: "Invalid OTP" });
  }
});

router.get("/confirm", (req, res) => {
  res.send("Api is working");
});

module.exports = router;
