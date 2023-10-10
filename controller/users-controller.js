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
    to: "renjithcm.renju@gmail.com",
    subject: `New Customer Registration Notification`,
    text: `Hello 2nd Storey,
    
We are pleased to inform you that a new customer has registered on our platform. Below are the details of the new customer:
    
Customer Name: ${first_name}  ${last_name}
Email Address: ${email}
   
    
This new customer has expressed interest in our services and products.

Thank you for your attention, and let's work together to ensure our new customer has a great experience with our company.
    
Best regards,

2nd Storey Team
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
  createGoogleUser: async (req, res) => {
    console.log(
      "🚀 ~ file: users-controller.js:60 ~ createGoogleUser: ~ req:",
      req.body
    );
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

      if (!userData) return res.status(401).json("Wrong username or password");

      const bytes = CryptoJS.AES.decrypt(
        userData.password,
        process.env.SECRET_KEY
      );
      const originalPassword = bytes.toString(CryptoJS.enc.Utf8);

      if (originalPassword !== req.body.password)
        return res.status(401).json("Wrong username or password");

      const accessToken = generateAccessToken(userData.id);
      const { password, ...other } = userData;
      return res.status(200).json({ ...other, accessToken });
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  },
  changePassword: async (req, res) => {
    try {
      const password = req.body.password;
      const email = req.body.email;
      const existingUser = (await Users.loginUser({ email: email }))[0];

      const data = await Users.ChangePassword({
        id: existingUser.ID,
        password: password,
      });
      res.status(200).json(data);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: err });
    }
  },
};

module.exports = UsersController;
