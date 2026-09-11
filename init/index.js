const mongoose = require('mongoose');
const initData = require('./data.js');
const listing = require('../models/listing.js');
const { object } = require('joi');
const User = require("../models/user.js");

const mogoose_url = "mongodb://127.0.0.1:27017/wanderlust";

main().then(() => {
        console.log("MongoDB connected successfully");
    })
    .catch((err) => {
        console.log("MongoDB connection error:", err);
    });

async function main() {
    await mongoose.connect(mogoose_url);
}

const initDB = async() => {
    await listing.deleteMany({});

    const user = await User.findOne();

    if (!user) {
        console.log("Pehle signup karo!");
        return;
    }

    initData.data = initData.data.map((obj) => ({
        ...obj,
        owner: user._id
    }));

    await listing.insertMany(initData.data);

    console.log("data was initialized");
};

initDB();