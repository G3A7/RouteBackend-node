import express from "express";
import {
  deleteUs,
  login,
  signup,
  update,
  authMe,
} from "../controllers/auth.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
const router = express.Router();
router.post("/signup", signup);
router.post("/login", login);
router.put("/update", authMiddleware, update);
router.delete("/delete", authMiddleware, deleteUs);
router.get("/users", authMiddleware, authMe);

export default router;
