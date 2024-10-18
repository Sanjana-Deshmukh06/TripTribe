const mongoose = require("mongoose");
const initdata = require("./data.js");
const Listing = require("../models/list.js");

const mongo_URL = "mongodb://127.0.0.1:27017/wanderLust";

main()
    .then(() => {
        console.log("connected to DB");
    }).catch((err) => {
        console.log(err);
    });


async function main() {
    await mongoose.connect(mongo_URL);
}

const initDB = async () => {
    await Listing.deleteMany({});
    initdata.data = initdata.data.map((obj) => ({ ...obj, owner: "66bf7d48855b3d656cee4a95" }));
    await Listing.insertMany(initdata.data);
    console.log("data was intialized");
};
initDB();