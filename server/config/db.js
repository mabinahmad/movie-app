require("dotenv").config();

const mongoose = require("mongoose");

// Function to connect to the MongoDB database
//---------------------------------------------
const connectDb = async () => {
  try {
    const { connection } = await mongoose.connect(process.env.MONGO_URI);
    // console.log("Database Connected: " + connection.host);
    //  mongoose.set("debug", true); // to show queries in terminal
  } catch (error) {}
};

module.exports = connectDb;
