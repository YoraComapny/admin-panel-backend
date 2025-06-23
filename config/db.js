import mongoose from "mongoose";

const connectDb = async (MONGO_DB) => {
  try {
    const conn = await mongoose.connect(MONGO_DB);
    console.log(`Database connected succsessfully\n`.blue, );
    return true;
  } catch (error) {
    console.log(error.message);
  }
};
export default connectDb;
