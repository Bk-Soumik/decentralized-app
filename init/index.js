const mongoose = require("mongoose");
const initData = require("./data.js");                          //Required data from data.js
const Listing = require("../models/listing.js");                //Required Schema from listing.js

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);                                             //Connected to Database
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {                                      //Inserting Data to fatabase
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({ ...obj, owner: "675ab746217c5cf540af9aa0"}));
  await Listing.insertMany(initData.data);
  console.log("data was initialized");
};

initDB();