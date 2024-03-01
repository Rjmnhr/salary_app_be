const express = require("express");
const dotenv = require("dotenv");
const Cors = require("cors");
const bodyParser = require("body-parser");
const pool = require("./mySQL-DB");
const salaryRoutes = require("./routes/salary-route");
const skillsRoutes = require("./routes/skills-route");
const otpAuth = require("./routes/otp-auth");
const userRoutes = require("./routes/users-route");
const tokenRoutes = require("./routes/verify-token");
const reportRoutes = require("./routes/reports-route");
const checkoutRoutes = require("./routes/checkout");
const paymentSuccessRoutes = require("./routes/payment_success");
const enquiryRoutes = require("./routes/enquiry");
const benchmarkRoutes = require("./routes/benchmark-routes");
const trackDataRoutes = require("./routes/track-data-route");
const surveyRoutes = require("./routes/survey-route");
const KPIRoutes = require("./routes/kpi-routes");

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

function verify(req, res, next) {
  const authHeader = req.headers.token;

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
      if (err)
        return res
          .status(403)
          .json({ status: 403, message: "Token is not valid!" });
      req.user = user;
      next();
    });
  } else {
    return res
      .status(401)
      .json({ status: 401, message: "you are not authenticated" });
  }
}

app.use("/api/salary", salaryRoutes);
app.use("/api/skills", skillsRoutes);
app.use("/api/otp", otpAuth);
app.use("/api/user", userRoutes);
app.use("/api/token", tokenRoutes);
app.use("/api/enquiry", enquiryRoutes);
app.use("/api/report", reportRoutes);
app.use("/api/benchmark", benchmarkRoutes);
app.use("/api/kpi", KPIRoutes);
app.use(checkoutRoutes);
app.use(paymentSuccessRoutes);
app.use("/api/track-data", trackDataRoutes);
app.use("/api/survey", surveyRoutes);

app.listen(port, () => console.log(`server is up on ${port}`));
