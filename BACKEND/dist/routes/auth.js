"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// BACKEND/src/routes/auth.ts
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const router = (0, express_1.Router)();
router.post("/login", authController_1.login);
router.post("/register", authController_1.register);
router.post("/logout", authController_1.logout);
router.get("/profile", authController_1.getProfile);
router.post("/register-risk-champion", authController_1.registerRiskChampion);
router.get("/risk-champions", async (req, res) => {
    try {
        const users = await require("../models/User").UserModel.find({ role: "champion" });
        // Map unit_id to unit for frontend compatibility
        const mappedUsers = users.map((user) => ({
            ...user.toObject(),
            unit: user.unit_id || ""
        }));
        res.json({ users: mappedUsers });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to fetch risk champions" });
    }
});
router.patch("/risk-champions/:id", async (req, res) => {
    try {
        const { unit_id } = req.body;
        console.log(`Updating user ${req.params.id} with unit_id: ${unit_id}`);
        if (!unit_id) {
            return res.status(400).json({ message: "unit_id is required" });
        }
        const user = await require("../models/User").UserModel.findByIdAndUpdate(req.params.id, { unit_id }, { new: true });
        if (!user) {
            console.log(`User not found with id: ${req.params.id}`);
            return res.status(404).json({ message: "User not found" });
        }
        console.log(`Successfully updated user: ${user.email}`);
        res.json({ success: true, user });
    }
    catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ message: "Failed to update unit", error: error instanceof Error ? error.message : "Unknown error" });
    }
});
router.delete("/risk-champions/:id", async (req, res) => {
    try {
        console.log(`Deleting user with id: ${req.params.id}`);
        const user = await require("../models/User").UserModel.findByIdAndDelete(req.params.id);
        if (!user) {
            console.log(`User not found with id: ${req.params.id}`);
            return res.status(404).json({ message: "User not found" });
        }
        console.log(`Successfully deleted user: ${user.email}`);
        res.json({ success: true });
    }
    catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ message: "Failed to delete champion", error: error instanceof Error ? error.message : "Unknown error" });
    }
});
exports.default = router;
