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
        const user = await require("../models/User").UserModel.findByIdAndUpdate(req.params.id, { unit_id }, { new: true });
        if (!user)
            return res.status(404).json({ message: "User not found" });
        res.json({ success: true, user });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to update unit" });
    }
});
router.delete("/risk-champions/:id", async (req, res) => {
    try {
        const user = await require("../models/User").UserModel.findByIdAndDelete(req.params.id);
        if (!user)
            return res.status(404).json({ message: "User not found" });
        res.json({ success: true });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to delete champion" });
    }
});
exports.default = router;
