const mongoose = require("mongoose");
const initData = require("./data.js");
const Value = require("../models/value.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/statfit";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Value.deleteMany({});
  console.log(initData);
  await Value.insertMany(initData);
  console.log("data was initialized");
};

initDB();
