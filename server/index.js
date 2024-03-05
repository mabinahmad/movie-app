const express = require("express");
const cors = require("cors");
const connectDb = require("./config/db");
require("dotenv").config();
const nodemailer = require("nodemailer");
const cookieParser = require("cookie-parser");
const app = express();
app.use(express.json());

const userRoute = require("./routes/user");
const movieRoute = require("./routes/movie");
const genreRoute = require("./routes/genre");
connectDb();

app.use(
  cors({
    // origin: "http://localhost:5174",
    origin: [
      "https://movie-app-nine-drab.vercel.app", //client app
      "https://movie-app-admin-panel-vl25.vercel.app", //admin panel
    ],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.static("public"));

app.use("/users", userRoute);
app.use("/movies", movieRoute);
app.use("/genres", genreRoute);

const PORT = 3005;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
