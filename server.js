// Dependencies
const cookieParser = require("cookie-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const express = require("express");
const fileUpload = require("express-fileupload");
const helmet = require("helmet");
const hpp = require("hpp");
const path = require("path");
const sanitize = require("express-mongo-sanitize");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");
const xss = require("xss-clean");
const connectDB = require("./config/connectDB");
const errorHandler = require("./middleware/error");

// Loading ENV Variables
dotenv.config({ path: "./config/config.env" });

// Database Connection
connectDB();

/* 
Routing Files
*/
const auth = require("./routes/auth");
const profile = require("./routes/profile");

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 100,
});

// App Initialization
const app = express();
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Mounting dependencies to our app
app.use(express.json());
app.use(cookieParser());
app.use(fileUpload());
app.use(sanitize());
app.use(helmet());
app.use(xss());
app.use(cors());
app.use(hpp());
app.use(limiter);

// Setting static folder for assets to be uploaded through server side rendering
app.use(express.static(path.join(__dirname, "public")));

/* 
Mounting Routes
*/
app.use("/api/v1/auth", auth);
app.use("/api/v1/auth/profile", profile);
app.use(errorHandler);

// Initializing server
const PORT = process.env.PORT || 5000;
const server = app.listen(
  PORT,
  console.log(
    `Server Running in: ${process.env.NODE_ENV} \nNode on Port: ${PORT}`
  )
);

// Catching Unhandled Promise Rejections
process.on("unhandledRejection", (error, promise) => {
  console.log(`Error: ${error.message}`);
  server.close(() => process.exit(1));
});
