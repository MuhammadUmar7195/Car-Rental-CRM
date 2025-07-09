import mongoose from "mongoose";

const connectDB = (url) => {
    return mongoose.connect(url)
        .then(() => console.log(`Connection success to Database.`))
        .catch((error) => {
            console.error("Error connecting to the database:", error.message);
            console.error("Full error details:", error);
        }), {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
    }
}

export default connectDB;