import express from "express";
const router = express.Router();
import { getLeetCodeContests } from "../services/leetcode.js";



router.get("/contests", async (req, res) => {
  try {
    const contests = await getLeetCodeContests();
    res.json(contests);
  } catch (err) {
    console.error("❌ API Error:", err.message);
    res.status(500).json({ error: "Failed to fetch LeetCode contests" });
  }
},);

export default router;
