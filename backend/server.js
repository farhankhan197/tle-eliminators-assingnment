import express from "express";
import cors from "cors";
import leetCodeRouter from "./routes/leetcode.js";
import codeForcesRouter from "./routes/codeforces.js";
import atCoderRouter from "./routes/atcoder.js";

const app = express();
const PORT = process.env.PORT || 8000;

// Enable CORS for all routes
app.use(cors(
  {
    origin: "http://localhost:3000",
  }
));
// Middleware
app.use(express.json());
app.use(express.urlencoded())
app.use("/api/leetcode", leetCodeRouter);
app.use("/api/codeforces", codeForcesRouter);
app.use("/api/atcoder", atCoderRouter);

// Default route
app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Welcome to the LeetCode Contest Tracker API 🚀",
    endpoints: {
      leetcode: "/api/leetcode",
      codeforces: "/api/codeforces",
      atcoder: "/api/atcoder",
      hackerrank: "/api/hackerrank",
      codechef: "/api/codechef",
      spoj: "/api/spoj",
      allContests: "/api/contests",
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
  console.log(`Server started successfully!`);
  console.log(`Running at: http://localhost:${PORT}`);
  console.log(" Available endpoints:");
  console.log(`• GET /api/contests -> Fetch contest data`);
  console.log("===========================================");
});
