import { connectToDatabase } from './config/database';
import express from 'express';
import cors from "cors";
import authRouter from "./routes/auth";
import riskRoutes from "./routes/risks";
import submissionsRoute from './routes/submissions';

const PORT = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend is running.");
});

// Register your auth routes under /api/auth
app.use("/api/auth", authRouter);
app.use('/api/risks', riskRoutes);
app.use('/api/submissions', submissionsRoute);

console.log(process.env.MONGODB_URI);

// Initialize database before starting server
connectToDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
