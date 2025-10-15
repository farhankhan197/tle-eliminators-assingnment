import express from "express";
import router from "./routes/contests.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use("/api/contests", router);

// Default route
app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Welcome to the LeetCode Contest Tracker API 🚀",
    endpoints: {
      contests: "/api/contests",
    },
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: "Endpoint not found. Please check your URL.",
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("❌ Server error:", err.stack);
  res.status(500).json({
    status: "error",
    message: "Internal server error.",
  });
});

// Start server
app.listen(PORT, () => {
  console.log("===========================================");
  console.log(`✅ Server started successfully!`);
  console.log(`🌐 Running at: http://localhost:${PORT}`);
  console.log("📡 Available endpoints:");
  console.log(`   • GET /api/contests -> Fetch contest data`);
  console.log("===========================================");
});
