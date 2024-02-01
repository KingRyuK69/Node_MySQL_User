const express = require("express");
const morgan = require("morgan");

// Loading environment variables from .env file
require("dotenv").config();

//import colour module
require("colors");

const app = express(); // creates an instance of an Express application.

// Setting up port
const PORT = process.env.PORT || 8000;

app.use(express.json()); // middleware function that parses incoming requests with JSON payloads
app.use(express.urlencoded({ extended: true })); // middleware function that parses incoming requests with URL-encoded payloads

// Using morgan for logging in development environment
if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

//mysql
const routes = require("./routes/route");

//squelize route
const route1 = require("./routes/infoRoute");
app.use("/api/users_info", route1); //set custom route to be used

app.use("/", routes); //deafalt route

app.listen(PORT, () => {
  console.log(
    `Server connected in ${process.env.NODE_ENV} mode on port ${PORT}`.bgMagenta
  ); // starts server
});
