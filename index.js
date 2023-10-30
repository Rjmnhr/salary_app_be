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

app.use("/api/salary", salaryRoutes);
app.use("/api/skills", skillsRoutes);
app.use("/api/otp", otpAuth);
app.use("/api/user", userRoutes);
app.use("/api/token", tokenRoutes);

app.use("/api/report", reportRoutes);
app.use(checkoutRoutes);
app.use(paymentSuccessRoutes);

app.listen(port, () => console.log(`server is up on ${port}`));
