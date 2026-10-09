const mongoose = require("mongoose");

const connectDB = async () => {
    await mongoose.connect("mongodb+srv://akshatp698_db_user:xAVicw8oogKawH4F@cluster0.gsvguoz.mongodb.net/devTinder");
}

module.exports = connectDB;

