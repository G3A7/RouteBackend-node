// import { connect } from "mongoose";
import mongoose from "mongoose";
export const connectDb = async () => {
  try {
    const con = await mongoose.connect(
      process.env.MONGO_URI.replace(
        "<db_password>",
        process.env.db_password
      ).replace("${DB_NAME}", process.env.DB_NAME)
    );
    console.log("ConnectDb Successfully 💥😎", con.connection.host);
  } catch (error) {
    console.log("error from DB", error);
    process.exit(1);
  }
};
