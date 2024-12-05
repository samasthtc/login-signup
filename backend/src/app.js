import express from "express";
import commonMiddleware from "../middleware/commonMiddleware.js";
import errorHandler from "../middleware/errorMiddleware.js";
import authRoutes from "../routes/authRoutes.js";
import protectedRoutes from "../routes/protectedRoutes.js";
import connectDB from "./config/db.js";

const app = express();
connectDB();

commonMiddleware(app);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/protected", protectedRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

app.use(errorHandler);

// eslint-disable-next-line no-undef
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend server running on port ${PORT}`));
