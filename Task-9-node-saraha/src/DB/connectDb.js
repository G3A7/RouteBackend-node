import mongoose from "mongoose";
export const connectDb = async () => {
  try {
    await mongoose.connect(
      process.env.MONGO_URI.replace(
        "<db_password>",
        process.env.db_password
      ).replace("${DB_NAME}", process.env.DB_NAME)
    );
    console.log("connect on DB 😍✔");
  } catch (error) {
    console.log("error from ConnectDb", error);
    process.exit(1);
  }
};
