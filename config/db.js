//const mongoose = require('mongoose'); using commonjs default

import mongoose from 'mongoose'; //es module

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.Mongo_URI);
        console.log('Database Connected Successfully :)');
    } catch (error) {
        console.error(error.message);
        process.exit(1);
    }
};

//module.exports = connectDB; using commonjs default

export default connectDB;