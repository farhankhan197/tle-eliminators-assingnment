import express from "express";
import fetch from "node-fetch";

const codeforcesRouter = express.Router();

async function fetchCF(url) {
  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      "Accept": "application/json",
    }
  });

  return res.json();
}

codeforcesRouter.get("/", async (req, res) => {
  try {
    const data = await fetchCF("https://codeforces.com/api/contest.list");

    const contests = data.result
      .filter(c => c.phase === "BEFORE")
      .map(c => ({
        name: c.name,
        url: `https://codeforces.com/contest/${c.id}`,
        platform: "codeforces",
        startTime: c.startTimeSeconds * 1000,   
        duration: c.durationSeconds           
      }));

    res.status(200).json({
      status: "success",
      platform: "codeforces",
      count: contests.length,
      data: contests,
    });

    console.log(`✅ Codeforces normalized: ${contests.length} contests`);
  } catch (err) {
    console.error("❌ Codeforces fetch failed, retrying once...");

    try {
      // Retry once with slight delay
      await new Promise(r => setTimeout(r, 500));
      const data = await fetchCF("https://codeforces.com/api/contest.list");

      const contests = data.result
        .filter(c => c.phase === "BEFORE")
        .map(c => ({
          name: c.name,
          url: `https://codeforces.com/contest/${c.id}`,
          platform: "codeforces",
          startTime: c.startTimeSeconds * 1000,
          duration: c.durationSeconds
        }));

      return res.status(200).json({
        status: "success",
        platform: "codeforces",
        count: contests.length,
        data: contests,
      });
    } catch (e) {
      console.error("❌ Retry also failed:", e);
      return res.status(500).json({
        status: "error",
        message: "Codeforces API unavailable — try again later",
      });
    }
  }
});

export default codeforcesRouter;
