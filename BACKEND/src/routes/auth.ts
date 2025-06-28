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
    console.log(`Updating user ${req.params.id} with unit_id: ${unit_id}`);
    
    if (!unit_id) {
      return res.status(400).json({ message: "unit_id is required" });
    }
    
    const user = await require("../models/User").UserModel.findByIdAndUpdate(
      req.params.id,
      { unit_id },
      { new: true }
    );
    
    if (!user) {
      console.log(`User not found with id: ${req.params.id}`);
      return res.status(404).json({ message: "User not found" });
    }
    
    console.log(`Successfully updated user: ${user.email}`);
    res.json({ success: true, user });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Failed to update unit", error: error instanceof Error ? error.message : "Unknown error" });
  }
});

router.delete("/risk-champions/:id", async (req: Request, res: Response) => {
  try {
    console.log(`Deleting user with id: ${req.params.id}`);
    
    const user = await require("../models/User").UserModel.findByIdAndDelete(req.params.id);
    
    if (!user) {
      console.log(`User not found with id: ${req.params.id}`);
      return res.status(404).json({ message: "User not found" });
    }
    
    console.log(`Successfully deleted user: ${user.email}`);
    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Failed to delete champion", error: error instanceof Error ? error.message : "Unknown error" });
  }
});

export default router;
