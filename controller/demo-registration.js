const nodemailer = require("nodemailer");

const notifyAdmin = (data) => {
  const {
    first_name,
    last_name,
    email,
    phone,
    industry,
    organization,
    title,
    date,
    time,
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
    from: "Equipay Partners <team@equipaypartners.com>",
    to: "renjithcm.renju@gmail.com , indradeep.mazumdar@gmail.com",
    subject: `New Registration for Pay Pulse Live Product Demo`,
    text: `Hello Admin,
    
We're excited to inform you that a new user has registered for the live demonstration of our product, Pay Pulse.
    
Registrant Details:

Name: ${first_name} ${last_name}
Email: ${email}
Phone : ${phone}
Title : ${title}
Organization : ${organization}
Industry : ${industry}
Date: ${date}
Time: ${time}

   
Please ensure that the registrant receives the meeting link and all necessary details for accessing the demo.

    
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

const notifyUser = (data) => {
  const { first_name, last_name, email, date, time } = data;

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
    to: email,
    subject: `Your Registration for the Pay Pulse Live Product Demo`,
    text: `Dear ${first_name} ${last_name},
    
Thank you for registering for the live demonstration of our product, Pay Pulse! We're excited to have you join us.

Event Details:
    
Date: ${date}
Time: ${time}
Location: Online

Shortly, you'll receive an email with the meeting link and additional details to access the demo. Please make sure to mark your calendar for the event.

If you have any questions or need further assistance, feel free to reach out to us at team@equipaypartners.com   
    
We look forward to showcasing the features and benefits of Pay Pulse to you!
    
Best regards,
Equipay Partners 
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
const DemoController = {
  demoRegister: async (req, res) => {
    try {
      notifyUser(req.body);
      notifyAdmin(req.body);
      res
        .status(200)
        .json({ status: 200, message: "Registration successful " });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: err });
    }
  },
};

module.exports = DemoController;
