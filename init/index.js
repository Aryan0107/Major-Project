require("dotenv").config();

const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const dbUrl = process.env.ATLAS_DB_URL;

main()
    .then(() => {
        console.log("Connected to Atlas");
        initDB();
    })
    .catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect(dbUrl);
}

const initDB = async () => {
    await Listing.deleteMany({});

    const data = initData.data.map((obj) => ({
        ...obj,
        owner: "6a29398dd508ba895ae66a2f"
    }));

    await Listing.insertMany(data);

    console.log("Database initialized");
    mongoose.connection.close();
};