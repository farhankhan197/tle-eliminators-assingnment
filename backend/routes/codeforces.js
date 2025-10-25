// routes/codeforces.js
import express from "express";
import fetch from "node-fetch";

const codeForcesRouter = express.Router();

codeForcesRouter.get("/", async (req, res) => {
  try {
    const response = await fetch("https://codeforces.com/api/contest.list");
    const data = await response.json();

    if (data.status !== "OK") {
      return res.status(500).json({
        status: "error",
        message: "Failed to fetch contests from Codeforces",
      });
    }

    const upcoming = data.result.filter(contest => contest.phase === "BEFORE");

    res.status(200).json({
      status: "success",
      source: "Codeforces",
      count: upcoming.length,
      contests: upcoming.map(contest => ({
        id: contest.id,
        name: contest.name,
        startTime: new Date(contest.startTimeSeconds * 1000).toISOString(),
        durationMinutes: contest.durationSeconds / 60,
        type: contest.type,
        preparedBy: contest.preparedBy || "Unknown",
      })),
    });
  } catch (error) {
    console.error("Error fetching Codeforces contests:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error while fetching Codeforces contests",
    });
  }
});

export default codeForcesRouter;
