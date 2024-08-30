const express = require("express");
const cors = require("express");
const cookie = require("cookie-parser");

const app = express(); //creating an instance of an express application

app.use(
  cors({
    origin: process.env.ORIGIN, // allow cross-origin request form origin
    credential: true, // allow credentials (cookies, auth) to be send in cross-origin
  })
);

app.use(express.json({ limti: "16kb" })); // accept data as json
app.use(express.urlencoded({ extended: true })); // accept url data in any format Express application to parse URL-encoded data from the request body
app.use(express.static("public")); // store data public folder
app.use(cookie());

//health Check route
const healthCheck = require('./route/healthCheck.js');
app.use("/healthcheck", healthCheck);

//home route
app.get("/", (req, res) => {
  res.status(200).json({
    message : "🚧 Page Under Construction 🚧 "
  })
})

// importing Route
const userRouter = require("./route/userRouter.js");
app.use("/api/v1/user", userRouter);

module.exports = app;
