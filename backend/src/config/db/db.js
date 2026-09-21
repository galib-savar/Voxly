import mongoose from "mongoose";

/**
 * Connect to the MongoDB database.
 */
const connectToDB = () => {
    mongoose.connect(process.env.MONGO_DB_URI)
        .then(() => {
            console.log("DB Connected");
        })
        .catch((error) => {
            console.error(error);
            process.exit(1);
        })
}

export default connectToDB;