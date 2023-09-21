const express = require("express");
const dotenv = require("dotenv");
const Cors = require("cors");
const bodyParser = require("body-parser");
const pool = require("./mySQL-DB");
const salaryRoutes = require("./routes/salary-route");

//App config
const app = express();
const port = process.env.PORT || 8003;

//middleware
dotenv.config();
app.use(Cors());
app.use(express.json());

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

app.listen(port, () => console.log(`server is up on ${port}`));
