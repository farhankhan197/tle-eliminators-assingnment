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

    // AtCoder has a table for upcoming contests
    $("#contest-table-upcoming tbody tr").each((_, el) => {
      const tds = $(el).find("td");
      const title = $(tds[1]).text().trim();
      const link = "https://atcoder.jp" + $(tds[1]).find("a").attr("href");
      const startTime = $(tds[0]).text().trim();
      const duration = $(tds[2]).text().trim();

      contests.push({ title, startTime, duration, link });
    });

    res.status(200).json({
      status: "success",
      source: "AtCoder",
      count: contests.length,
      contests,
    });
  } catch (error) {
    console.error("Error fetching AtCoder contests:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch AtCoder contests",
    });
  }
});

export default atCoderRouter;
