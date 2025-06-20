// BACKEND/src/routes/auth.ts
import { Router } from "express";
import { login, register, logout, getProfile } from "../controllers/authController";

const router = Router();

router.post("/login", login);
router.post("/register", register);
router.post("/logout", logout);
router.get("/profile", getProfile);

export default router;
