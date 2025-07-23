import express from "express";

import authUser from "./modules/user/user.controller.js";
import { connectDb } from "./DB/connectDb.js";
const bootstrap = () => {
  const app = express();
  // const port = 3000;
  app.use(express.json());

  app.use("/api/v1/auth/", authUser);

  app.all("{/*dummy}", (req, res) => {
    res.status(404).json({ message: "not found ✖" });
  });

  app.use((err, req, res, next) => {
    err.message = err.message || "Internal Server Error";
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";

    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      errorStack: err.stack,
    });
  });
  app.listen(process.env.PORT, () => {
    console.log("server running 😱");
    connectDb();
  });
};

export default bootstrap;
