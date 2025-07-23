import express from "express";
import { getAuth, login, singup, confirm } from "./user.service.js";
import { authMiddleWare } from "../../middleware/auth.middleware.js";
import { loginSchema, signupSchema } from "./user.validator.js";
import { validation } from "../../middleware/validation.middleware.js";
const router = express.Router();

router.post("/signup", validation(signupSchema), singup);
router.post("/login", validation(loginSchema), login);
router.get("/getAuth", authMiddleWare, getAuth);
router.get("/confirm/:token", confirm);

export default router;
