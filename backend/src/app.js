import express from "express";
import connectDB from "../config/db.js";
import swaggerDocs from "../docs/swagger.js";
import commonMiddleware from "../middleware/commonMiddleware.js";
import errorHandler from "../middleware/errorMiddleware.js";
import authRoutes from "../routes/authRoutes.js";
import postRoutes from "../routes/postRoutes.js";
import userRoutes from "../routes/userRoutes.js";

const app = express();
// eslint-disable-next-line no-undef
const PORT = process.env.PORT || 5000;
connectDB();

commonMiddleware(app);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);

swaggerDocs(app, PORT);

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

app.use(errorHandler);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Backend server running on port ${PORT}`);
});
