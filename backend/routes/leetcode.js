import express from "express";
const leetCodeRouter = express.Router();
import { getLeetCodeContests } from "../services/leetcode.js";



leetCodeRouter.get("/contests", async (req, res) => {
  try {
    const contests = await getLeetCodeContests();
    res.json(contests);
  } catch (err) {
    console.error("❌ API Error:", err.message);
    res.status(500).json({ error: "Failed to fetch LeetCode contests" });
  }
},);

export default leetCodeRouter;
