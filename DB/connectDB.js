import mongoose from "mongoose";

const connectDB = (URI) => {
    return mongoose.connect(URI)
}

export default connectDB;