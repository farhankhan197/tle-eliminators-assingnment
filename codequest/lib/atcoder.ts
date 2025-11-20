import * as cheerio from "cheerio";

export type AtCoderContest = {
  title: string;
  url: string;
  platform: string;
  startTime: number;
  duration: number;
};

export async function getAtCoderContests(): Promise<AtCoderContest[]> {
  const response = await fetch("https://atcoder.jp/contests/");
  const html = await response.text();
  const $ = cheerio.load(html);

  const contests: AtCoderContest[] = [];

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
    const title = titleRaw
      .replace(/[\u2460-\u24FF\u25A0-\u25FF\u2600-\u27BF]/g, "")
      .trim();

    contests.push({
      title,
      url: link,
      platform: "atcoder",
      startTime,
      duration,
    });
  });

  console.log(contests);

  return contests;
}

getAtCoderContests();
