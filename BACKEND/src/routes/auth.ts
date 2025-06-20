import { UserModel } from "../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Request, Response, Router } from "express";


const router = Router();

router.post("/login", async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  try {
   // const user = await UserModel.findOne({ where: { email } });
   const user = await UserModel.scope('withPassword').findOne({ where: { email } }); 
   if (!user) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }
    const isMatch = await bcrypt.compare(password, user.password); // or user.password_hash
    if (!isMatch) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }
    // Create JWT token (optional, for stateless auth)
    const token = jwt.sign(
  { id: user.id, role: user.role, email: user.email },
  process.env.JWT_SECRET as string,
  { expiresIn: "1h" }
);


console.log("Authenticated user:", user.role); // add this

    res.json({
      message: "Login successful",
      role: user.role,
      token, // send token to frontend if using JWT
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;