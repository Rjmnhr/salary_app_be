const express = require("express");
const dotenv = require("dotenv");
const Cors = require("cors");
const bodyParser = require("body-parser");
const pool = require("./config/mySQL-DB");
const otpAuth = require("./routes/otp-auth");
const userRoutes = require("./routes/users-route");
const tokenRoutes = require("./routes/verify-token");
const payPulseUserActivity = require("./routes/paypulse-activity-routes");
const checkoutRoutes = require("./routes/checkout");
const paymentSuccessRoutes = require("./routes/payment_success");
const enquiryRoutes = require("./routes/enquiry");
const benchmarkRoutes = require("./routes/benchmark-routes");
const trackDataRoutes = require("./routes/track-data-route");
const surveyRoutes = require("./routes/survey-route");
const KPIRoutes = require("./routes/kpi-routes");
const generatePDFRoutes = require("./routes/generatePDF");
const payPulseRoute = require("./routes/paypulse-routes");
const demoRoutes = require("./routes/demo-registeration-route");
const authenticateToken = require("./utils/auth");
const jwt = require("jsonwebtoken");
//App config
const app = express();
const port = process.env.PORT || 8003;

//middleware
dotenv.config();
app.use(Cors());

app.use(
  express.json({
    // We need the raw body to verify webhook signatures.
    // Let's compute it only when hitting the Stripe webhook endpoint.
    verify: function (req, res, buf) {
      if (req.originalUrl.startsWith("/webhook")) {
        req.rawBody = buf.toString();
      }
    },
  })
);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//DB config
pool
  .getConnection()
  .then((connection) => {
    console.log("Connected to MySQL database");
    connection.release();
  })
  .catch((err) => {
    console.error("Error connecting to MySQL database:", err.message);
  });

app.use("/api/paypulse", authenticateToken, payPulseRoute);
app.use("/api/pay-pulse", authenticateToken, payPulseUserActivity);
app.use("/api/user", userRoutes);
app.use("/api/track-data", trackDataRoutes);
app.use("/api/demo", demoRoutes);
app.use("/api/otp", otpAuth);
app.use("/api/token", tokenRoutes);
app.use("/api/enquiry", enquiryRoutes);
app.use("/api/benchmark", benchmarkRoutes);
app.use("/api/kpi", KPIRoutes);
app.use(checkoutRoutes);
app.use(paymentSuccessRoutes);
// app.use("/api/track-data", trackDataRoutes);
app.use("/api/survey", surveyRoutes);
app.use("/api", generatePDFRoutes);

// function generateToken() {
//   const secretKey = process.env.SECRET_KEY; // Replace 'your_secret_key' with your actual secret key
//   const token = jwt.sign({}, secretKey);
//   return token;
// }

// const token = generateToken();
// console.log("🚀 ~ token:", token);

app.listen(port, () => console.log(`server is up on ${port}`));
