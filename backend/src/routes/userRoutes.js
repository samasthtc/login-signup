import express from "express";

const router = express.Router();

// Example endpoints
router.get("/", (req, res) => {
  res.json([
    { id: 1, name: "John Doe" },
    { id: 2, name: "Jane Smith" },
  ]);
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  // Mock login logic
  if (email === "admin@example.com" && password === "password") {
    res.json({ success: true, message: "Logged in!" });
  } else {
    res.status(401).json({ success: false, message: "Invalid credentials" });
  }
});

export default router;
