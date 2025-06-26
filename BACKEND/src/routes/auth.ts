// BACKEND/src/routes/auth.ts
import { Router, Request, Response } from "express";
import { login, register, logout, getProfile, registerRiskChampion } from "../controllers/authController";

const router = Router();

router.post("/login", login);
router.post("/register", register);
router.post("/logout", logout);
router.get("/profile", getProfile);
router.post("/register-risk-champion", registerRiskChampion);
router.get("/risk-champions", async (req, res) => {
  try {
    const users = await require("../models/User").UserModel.find({ role: "champion" });
    // Map unit_id to unit for frontend compatibility
    const mappedUsers = users.map((user: any) => ({
      ...user.toObject(),
      unit: user.unit_id || ""
    }));
    res.json({ users: mappedUsers });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch risk champions" });
  }
});

router.patch("/risk-champions/:id", async (req: Request, res: Response) => {
  try {
    const { unit_id } = req.body;
    const user = await require("../models/User").UserModel.findByIdAndUpdate(
      req.params.id,
      { unit_id },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: "Failed to update unit" });
  }
});

router.delete("/risk-champions/:id", async (req: Request, res: Response) => {
  try {
    const user = await require("../models/User").UserModel.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete champion" });
  }
});

export default router;
