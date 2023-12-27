const express = require("express");
const dotenv = require("dotenv").config();
const bodyParser = require("body-parser");
const cors = require("cors");
const connectToMongo = require("./db");
const userRoute = require("./routes/userRoute");
const roleRoutes = require("./routes/roleRoute");
const employRoutes = require("./routes/employeeMasterRout");
const companyRoute = require("./routes/companyMasterRout");
const checkupRoute = require("./routes/checkupRoutes")
const errorHandler = require("./middlewares/errorMiddleware");
const cookieParser = require("cookie-parser");
const protect = require("./middlewares/authMiddleware");
const helmet = require("helmet");
const morgan = require("morgan");








// const menuRoutes = require("./routes/menuRoutes");

// DATA IMPORTS
const User = require("./models/User");

// MIDDLEWARES
connectToMongo();
const app = express();
const port =  process.env.PORT || 5005;
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(helmet());
app.use(
  helmet.crossOriginResourcePolicy({
    policy: "cross-origin",
  })
);


// ----------------------------------Define a custom morgan format ----------------------------------------
morgan.token("color-status", (req, res) => {
  const status = res.statusCode;
  let color;
  if (status >= 500) {
    color = "\x1b[31m";
  } else if (status >= 400) {
    color = "\x1b[33m";
  } else if (status >= 300) {
    color = "\x1b[36m";
  } else {
    color = "\x1b[32m";
  }
  return color + status + "\x1b[0m";
});

const customFormat = ":method :url :color-status :response-time ms";


app.use(morgan(customFormat));
// ----------------------------------Define a custom morgan format ----------------------------------------

app.use(cors());
app.use("/uploads", express.static("./uploads"));
app.use("/gallery-images", express.static("./uploads/Gallery"));
app.use("/products", express.static("./uploads/Products"));
app.use("/cagtegory", express.static("./uploads/Category"));
app.use("/banner", express.static("./uploads/Banner"));
app.use("/blog-images", express.static("./uploads/Blog"));
app.use("/color", express.static("./uploads/Color"));


// Routes Middleware

app.use("/api", userRoute);
app.use("/api", roleRoutes);
app.use("/employ", employRoutes);
app.use("/company",companyRoute);
app.use("/checkup",checkupRoute)

// Error Middleware
// app.use(errorHandler);
// app.use(protect);

// ROUTES
app.get("/", (req, res) => {
  res.send("Home Page");
});
app.listen(port, () => {
  console.log("Server Started on", port);
});
