const Users = require("../models/users-model");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

function generateAccessToken(userId) {
  return jwt.sign({ id: userId }, process.env.SECRET_KEY, { expiresIn: "5d" });
}

const notifyByMail = (data) => {
  const { first_name, last_name, email } = data;

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
    subject: `New Customer Registration Notification`,
    text: `Hello Equipay Partners,
    
We are pleased to inform you that a new customer has registered on our platform. Below are the details of the new customer:
    
Customer Name: ${first_name}  ${last_name}
Email Address: ${email}
   
    
This new customer has expressed interest in our services and products.

Thank you for your attention, and let's work together to ensure our new customer has a great experience with our company.
    
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

const UsersController = {
  getAll: async (req, res) => {
    try {
      const userData = (await Users.getAll({ id: req.query.id }))[0];

      if (!userData) return res.status(400).json("user details not found");

      return res.status(200).json(userData);
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  },
  createGoogleUser: async (req, res) => {
    try {
      const existingUser = (await Users.loginUser(req.body))[0];

      if (existingUser) {
        if (existingUser.password === "Google password") {
          const accessToken = generateAccessToken(existingUser.id);

          const { password, ...other } = existingUser;
          return res.status(200).json({ ...other, accessToken });
        }

        return res.status(401).json("User info doesn't match with Google user");
      } else {
        const CreateUserData = await Users.createGoogleUser(req.body);

        if (!CreateUserData)
          return res.status(402).json("creating Google user failed");

        notifyByMail(req.body);

        const newUser = (await Users.loginUser(req.body))[0];
        const accessToken = generateAccessToken(newUser.id);

        const { password, ...other } = newUser;
        return res.status(200).json({ ...other, accessToken });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: err });
    }
  },
  createUser: async (req, res) => {
    try {
      const existingUser = (await Users.loginUser(req.body))[0];

      if (existingUser) return res.status(400).json("Duplication Entry");

      const CreateUser = await Users.createUser(req.body);

      if (!CreateUser) return res.status(200).json("creating user failed");

      notifyByMail(req.body);

      const newUser = (await Users.loginUser(req.body))[0];

      const accessToken = generateAccessToken(newUser.id);

      const { password, ...other } = newUser;
      return res.status(200).json({ ...other, accessToken });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: err });
    }
  },

  loginUser: async (req, res) => {
    try {
      const userData = (await Users.loginUser(req.body))[0];

      if (!userData) return res.status(200).json(404);

      const bytes = CryptoJS.AES.decrypt(
        userData.password,
        process.env.SECRET_KEY
      );
      const originalPassword = bytes.toString(CryptoJS.enc.Utf8);

      if (originalPassword !== req.body.password)
        return res.status(200).json(404);

      const accessToken = generateAccessToken(userData.id);
      const { password, ...other } = userData;
      return res.status(200).json({ ...other, accessToken });
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  },
  resetPassword: async (req, res) => {
    try {
      const password = req.body.password;
      const email = req.body.email;
      const existingUser = (await Users.loginUser({ email: email }))[0];

      const data = await Users.resetPassword({
        id: existingUser.id,
        password: password,
      });
      res.status(200).json(data);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: err });
    }
  },
  changeEmail: async (req, res) => {
    try {
      const { email, id } = req.body;
      const existingUser = (await Users.loginUser({ email: email }))[0];

      if (existingUser) return res.status(200).json(404);

      const data = await Users.changeEmail(req.body);
      res.status(200).json(200);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: err });
    }
  },
  UpgradePlan: async (req, res) => {
    try {
      const data = await Users.UpgradePlan(req.body);
      res.status(200).json({ plan: req.body.plan });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: err });
    }
  },
  checkForExistingUser: async (req, res) => {
    try {
      const userData = (await Users.loginUser(req.body))[0];

      if (userData) return res.status(200).json(true);
      return res.status(200).json(false);
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  },
};

module.exports = UsersController;
