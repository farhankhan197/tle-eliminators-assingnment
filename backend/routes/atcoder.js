// routes/atcoder.js
import express from "express";
import fetch from "node-fetch";
import * as cheerio from "cheerio";

const atCoderRouter = express.Router();

atCoderRouter.get("/", async (req, res) => {
  try {
    const response = await fetch("https://atcoder.jp/contests/");
    const html = await response.text();
    const $ = cheerio.load(html);

    const contests = [];

    // Parse upcoming contests
    $("#contest-table-upcoming tbody tr").each((_, el) => {
      const tds = $(el).find("td");

      const titleRaw = $(tds[1]).text().trim();
      const link = "https://atcoder.jp" + $(tds[1]).find("a").attr("href");

      // Convert start time to Unix timestamp (ms)
      const startTime = new Date($(tds[0]).text().trim()).getTime();

      // Convert duration "HH:MM" → seconds
      const durationRaw = $(tds[2]).text().trim();
      const [hours, minutes] = durationRaw.split(":").map(Number);
      const duration = (hours * 60 + minutes) * 60;

      // Clean weird Unicode (Ⓐ, ◉, etc.)
      const title = titleRaw.replace(/[\u2460-\u24FF\u25A0-\u25FF\u2600-\u27BF]/g, "").trim();

      contests.push({
        name: title,
        url: link,
        platform: "atcoder",
        startTime,
        duration,
      });
    });

    res.status(200).json({
      status: "success",
      platform: "atcoder",
      count: contests.length,
      data: contests, 
    });

    console.log("✅ AtCoder contests normalized and sent:", contests);
  } catch (error) {
    console.error("❌ Error fetching AtCoder contests:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch AtCoder contests",
    });
  }
});

export default atCoderRouter;
