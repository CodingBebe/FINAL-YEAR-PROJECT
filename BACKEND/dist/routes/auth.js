"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = require("../models/User");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express_1 = require("express");
const router = (0, express_1.Router)();
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        // const user = await UserModel.findOne({ where: { email } });
        const user = await User_1.UserModel.scope('withPassword').findOne({ where: { email } });
        if (!user) {
            res.status(401).json({ message: "Invalid credentials" });
            return;
        }
        const isMatch = await bcryptjs_1.default.compare(password, user.password); // or user.password_hash
        if (!isMatch) {
            res.status(401).json({ message: "Invalid credentials" });
            return;
        }
        // Create JWT token (optional, for stateless auth)
        const token = jsonwebtoken_1.default.sign({ id: user.id, role: user.role, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });
        console.log("Authenticated user:", user.role); // add this
        res.json({
            message: "Login successful",
            role: user.role,
            token, // send token to frontend if using JWT
        });
    }
    catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ message: "Server error" });
    }
});
exports.default = router;
