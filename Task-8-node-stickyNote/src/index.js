import express from "express";
import dotenv from "dotenv";
dotenv.config();
import authUser from "./Routes/auth.route.js";
import authNote from "./Routes/note.route.js";
import { connectDb } from "./utils/DbConnect.js";

const app = express();

app.use(express.json());
app.use("/api/v1/auth", authUser);
app.use("/api/v1/notes", authNote);

app.listen(3000, () => {
  console.log("Server Runing 😎💥");
  connectDb();
});
